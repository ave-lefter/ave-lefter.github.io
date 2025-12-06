#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

source ./env.sh

PROJECT="ave-pro-gh"
DIR="jump_github"

rm -rf dist

pnpm install
# 构建
pnpm generate

# cd 到构建输出的目录下
cd dist
touch .nojekyll

cd ..

# 清除发布文件
ssh test << ENDSSH
cd /root/$DIR/;
rm -rf $PROJECT;
rm -rf $PROJECT-dist;
ENDSSH

scp -r dist test:/root/$DIR/$PROJECT-dist

ssh test << ENDSSH
cd /root/$DIR/;
rm -rf $PROJECT;
mv $PROJECT-dist $PROJECT;
cd $PROJECT;
git init;

echo 'pro.ave.ai' > CNAME;
git add -A;
git commit -m 'deploy';
git push -f https://$GITHUB_ACCESS_TOKEN@github.com/aveprodex/aveprodex.github.io.git master:main;


echo 'pro.avesp.xyz' > CNAME;
git add -A;
git commit --amend --no-edit;
git push -f https://$GITHUB_ACCESS_TOKEN2@github.com/suyogzt0/suyogzt0.github.io.git master:main;

# git commit --amend --no-edit;

ENDSSH

# 清除发布文件
ssh test << ENDSSH
cd /root/$DIR/;
rm -rf $PROJECT;
rm -rf $PROJECT-dist;
ENDSSH

# cd -
