import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3'
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront'
import { Upload } from '@aws-sdk/lib-storage'
import pLimit from 'p-limit'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import os from 'os'
import { fileURLToPath } from 'url'
import { accessKeyId, secretAccessKey, region, cloudfrontDistributionId, s3BasePath, bucketName } from './s3key.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (!(accessKeyId && secretAccessKey && region && bucketName)) {
  console.error('缺少必要的配置，请检查 s3key.js 文件')
  process.exit(1)
}

// 初始化 S3 客户端
const s3Client = new S3Client({
  credentials: { accessKeyId, secretAccessKey },
  region,
  maxAttempts: 3,
  requestHandler: {
    httpOptions: {
      timeout: 300000, // 300秒超时
    },
  },
})

// 初始化 CloudFront 客户端
const cloudfrontClient = new CloudFrontClient({
  credentials: { accessKeyId, secretAccessKey },
  region,
})

// 动态并发控制
const limit = pLimit(Math.min(10, os.cpus().length * 2))

// 递归获取文件夹内所有文件路径
function getAllFiles(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList)
    } else {
      fileList.push(filePath)
    }
  }
  return fileList
}

// 检测文件是否已存在（基于文件大小和最后修改时间）
const checkFileByLastModified = async (bucketName, key, localFilePath) => {
  try {
    const response = await s3Client.send(
      new HeadObjectCommand({ Bucket: bucketName, Key: key })
    )
    const localStats = fs.statSync(localFilePath)

    if (
      response.ContentLength === localStats.size &&
      new Date(response.LastModified).getTime() >= localStats.mtime.getTime()
    ) {
      return true
    }
  } catch (err) {
    if (err.name === 'NotFound') {
      return false
    }
    throw err
  }
  return false
}

// 上传单个文件到 S3
async function uploadFileToS3(filePath, bucketName, key) {
  const isDuplicate = await checkFileByLastModified(bucketName, key, filePath)
  if (isDuplicate) {
    console.log(`文件已存在，跳过上传: ${key}`)
    return
  }

  const fileStream = fs.createReadStream(filePath)
  const mimeType = mime.lookup(filePath) || 'application/octet-stream'

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: mimeType,
    },
    queueSize: 4,
    partSize: 5 * 1024 * 1024, // 每块 5MB
  })

  try {
    const response = await upload.done()
    console.log(`上传成功: ${key}`)
    return response
  } catch (err) {
    console.error(`上传失败: ${key}`, err)
    throw err
  }
}

// 上传文件夹内容到 S3
async function uploadFolderContentsToS3(folderPath, bucketName, s3BasePath) {
  const files = getAllFiles(folderPath)
  let uploadedCount = 0

  const uploadPromises = files.map((filePath) => {
    const relativePath = path.relative(folderPath, filePath)
    const s3Key = path.join(s3BasePath, relativePath).replace(/\\/g, '/')
    return limit(async () => {
      await uploadFileToS3(filePath, bucketName, s3Key)
      uploadedCount += 1
      console.log(`上传进度: ${uploadedCount}/${files.length}`)
    })
  })

  await Promise.all(uploadPromises)
  console.log('文件夹内容上传完成！')
  return true
}

// 创建 CloudFront 缓存失效
async function createCloudFrontInvalidation() {
  if (!cloudfrontDistributionId) {
    console.warn('CloudFront Distribution ID 未配置，跳过缓存失效')
    return
  }

  const params = {
    DistributionId: cloudfrontDistributionId,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ['/*'],
      },
    },
  }

  try {
    const command = new CreateInvalidationCommand(params)
    const response = await cloudfrontClient.send(command)
    console.log('CloudFront 缓存失效请求成功:', response.Invalidation.Id)
  } catch (err) {
    console.error('CloudFront 缓存失效请求失败:', err)
  }
}

// 主入口
async function main() {
  const folderPath = path.join(__dirname, './dist')

  try {
    await uploadFolderContentsToS3(folderPath, bucketName, s3BasePath)

    // 延迟触发缓存失效
    setTimeout(async () => {
      await createCloudFrontInvalidation()
    }, 2000)
  } catch (err) {
    console.error('上传失败:', err)
  }
}

main().catch((err) => console.error('运行失败:', err))
