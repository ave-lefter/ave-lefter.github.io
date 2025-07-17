#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 设置字符编码为 UTF-8
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

# 配置远程仓库信息
CONFIG_REPO_URL="git@github.com:panyongxu1002/ave_deploy-config.git"  # 替换为你的私有配置仓库
CONFIG_FILE_NAME="config-a.env"  # 配置文件名，test2.sh 使用 config-a.env
TEMP_CONFIG_DIR="ave_deploy-config"

# 获取远程配置文件
echo "📥 获取远程配置文件..."
rm -rf "$TEMP_CONFIG_DIR"
git clone --depth 1 "$CONFIG_REPO_URL" "$TEMP_CONFIG_DIR" || {
    echo "❌ 无法克隆配置仓库，请检查仓库地址和访问权限"
    exit 1
}

# 复制配置文件到当前目录，避免嵌套 git 仓库问题
cp "$TEMP_CONFIG_DIR/$CONFIG_FILE_NAME" "./temp-config.env" || {
    echo "❌ 无法复制配置文件"
    rm -rf "$TEMP_CONFIG_DIR"
    exit 1
}

# 复制模板文件
cp "$TEMP_CONFIG_DIR/remote-workflow-template.yml" "./remote-workflow-template.yml" || {
    echo "❌ 无法复制模板文件"
    rm -rf "$TEMP_CONFIG_DIR"
    exit 1
}

# 立即清理配置仓库，避免嵌套问题
rm -rf "$TEMP_CONFIG_DIR"

# 加载配置
echo "📋 加载配置文件: $CONFIG_FILE_NAME"
source "./temp-config.env"

# 获取当前时间（UTC-8 北京时间）
TIMESTAMP=$(TZ='Asia/Shanghai' date +"%Y-%m-%d %H:%M:%S CST")
# 获取当前分支
BRANCH=$(git rev-parse --abbrev-ref HEAD)
# 获取最新提交信息
COMMIT_SHA=$(git rev-parse --short HEAD)
# 获取提交信息并处理编码
COMMIT_MESSAGE=$(git log -1 --pretty=%B | tr '\n' ' ' | iconv -f UTF-8 -t UTF-8 2>/dev/null || git log -1 --pretty=%B | tr '\n' ' ')
AUTHOR_NAME=$(git log -1 --pretty=%an | iconv -f UTF-8 -t UTF-8 2>/dev/null || git log -1 --pretty=%an)

# 发送开始部署通知到飞书的函数
send_start_notification() {
    echo "📦 发送开始部署通知到飞书..."
    for webhook_url in "${FEISHU_WEBHOOK_URLS[@]}"; do
        curl -X POST "$webhook_url" \
            -H "Content-Type: application/json; charset=utf-8" \
            -d "{
                \"msg_type\": \"text\",
                \"content\": {
                    \"text\": \"🚀 $PROJECT_DISPLAY_NAME 开始部署\\n\\n📦 项目: $PROJECT_NAME\\n🌿 分支: $BRANCH\\n👤 作者: $AUTHOR_NAME\\n💬 提交: $COMMIT_MESSAGE\\n🕐 时间: $TIMESTAMP\"
                }
            }" \
            --silent --show-error || echo "⚠️  发送飞书开始通知失败: $webhook_url"
    done
}

# 发送推送成功通知到飞书的函数
send_push_success_notification() {
    echo "📤 发送推送成功通知到飞书..."
    for webhook_url in "${FEISHU_WEBHOOK_URLS[@]}"; do
        curl -X POST "$webhook_url" \
            -H "Content-Type: application/json; charset=utf-8" \
            -d "{
                \"msg_type\": \"text\",
                \"content\": {
                    \"text\": \"📤 代码推送成功，GitHub Pages 正在部署...\\n\\n📦 项目: $PROJECT_NAME\\n🌿 分支: $BRANCH\\n👤 作者: $AUTHOR_NAME\\n💬 提交: $COMMIT_MESSAGE\\n⏳ 部署完成后将通过 GitHub Actions 自动发送通知\"
                }
            }" \
            --silent --show-error || echo "⚠️  发送飞书推送成功通知失败: $webhook_url"
    done
}

# 发送失败通知到飞书的函数
send_failure_notification() {
    echo "❌ 发送部署失败通知到飞书..."
    for webhook_url in "${FEISHU_WEBHOOK_URLS[@]}"; do
        curl -X POST "$webhook_url" \
            -H "Content-Type: application/json; charset=utf-8" \
            -d "{
                \"msg_type\": \"text\",
                \"content\": {
                    \"text\": \"💥 $PROJECT_DISPLAY_NAME 构建或推送失败！\\n\\n📦 项目: $PROJECT_NAME\\n🌿 分支: $BRANCH\\n👤 作者: $AUTHOR_NAME\\n💬 提交: $COMMIT_MESSAGE\\n❌ 失败时间: $TIMESTAMP\\n\\n请检查构建日志并修复问题。\"
                }
            }" \
            --silent --show-error || echo "⚠️  发送飞书失败通知失败: $webhook_url"
    done
}

# 设置错误处理，当脚本出错时发送失败通知
trap 'send_failure_notification; rm -f "./temp-config.env" "./remote-workflow-template.yml"; exit 1' ERR

# 发送开始部署通知
send_start_notification

echo "🚀 开始部署 $PROJECT_DISPLAY_NAME..."

# 清理旧文件
echo "🗑️  清理旧文件..."
rm -rf dist

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm generate

# 创建 GitHub Actions workflow 目录和文件（在进入 dist 之前）
echo "📄 添加 GitHub Actions workflow..."
mkdir -p dist/.github/workflows

# 生成 workflow 文件（在当前目录，模板文件也在当前目录）
TEMPLATE_PATH="./remote-workflow-template.yml"
if [ ! -f "$TEMPLATE_PATH" ]; then
    echo "❌ 模板文件不存在: $TEMPLATE_PATH"
    echo "📁 当前目录: $(pwd)"
    echo "📋 当前目录文件列表:"
    ls -la | grep -E "(remote-|temp-)"
    exit 1
fi

# 将数组转换为逗号分隔的字符串用于模板
WEBHOOK_URLS_STRING=$(IFS=','; echo "${FEISHU_WEBHOOK_URLS[*]}")

sed -e "s|{{FEISHU_WEBHOOK_URLS}}|$WEBHOOK_URLS_STRING|g" \
    -e "s|{{DEPLOYMENT_URL}}|$DEPLOYMENT_URL|g" \
    -e "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" \
    -e "s|{{PROJECT_DISPLAY_NAME}}|$PROJECT_DISPLAY_NAME|g" \
    -e "s|{{GITHUB_REPO}}|$GITHUB_REPO|g" \
    "$TEMPLATE_PATH" > dist/.github/workflows/notify.yml

echo "✅ GitHub Actions workflow 已生成"

# 准备部署文件
echo "📁 准备部署文件..."
cd dist
touch .nojekyll

echo "✅ GitHub Actions workflow 已生成"

# 推送到 GitHub Pages
echo "📤 推送到 GitHub Pages..."

# 初始化新的 git 仓库（在 dist 目录中）
git init
git add -A

# 检查是否有变更需要提交
if git diff --cached --quiet; then
    echo "ℹ️  没有新的变更，创建一个时间戳文件..."
    echo "Deploy timestamp: $(date)" > deploy-timestamp.txt
    git add deploy-timestamp.txt
fi

git commit -m 'deploy'

# 检查是否已有 origin 远程仓库，如果有就删除重新添加
if git remote get-url origin >/dev/null 2>&1; then
    echo "🔄 删除现有的 origin 远程仓库..."
    git remote remove origin
fi

echo "➕ 添加 origin 远程仓库..."
git remote add origin "$GITHUB_REPO_URL"
git push -f origin main

# 返回上级目录
cd ..

echo "✅ 代码推送完成！"

# 发送推送成功通知
send_push_success_notification

# 清理临时文件
rm -f "./temp-config.env" "./remote-workflow-template.yml"

echo "🎉 代码已推送到 GitHub Pages，部署状态将通过 GitHub Actions 自动通知到飞书！"