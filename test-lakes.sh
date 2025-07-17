#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e


#del发布文件
rm -rf dist

pnpm install
# 构建
pnpm generate

# cd 到构建输出的目录下
cd dist
touch .nojekyll

git init --initial-branch=master
git add -A
git commit -m 'deploy'
git remote add origin git@github.com:ave-test-11/ave-test-11.github.io.git
git push -f origin master:main

cd -
