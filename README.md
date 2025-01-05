# 关于我
The application will integrate with earthquake data

# 关于这个项目

.....

# Configure AWS credential on local

## 检查当前 AWS CLI 是否配置了正确的账户和区域。
```
aws configure
```

## 测试配置是否有效
```
aws sts get-caller-identity
```

# 通过CDK来本地部署AWS资源

这个项目里我采取的是通过本地cdk来部署资源，所以确保本地安装了aws cdk

在正式的项目中可以通过aws codepiline或者github action等这些ci cd服务来部署，这样只需提交代码便可，省去了手动部署的步骤

## 执行 CDK Bootstrap

如果当前账户在此区域没执行过cdk的话，需要执行bootstrap

在 `infra` 目录下运行以下命令

```
npx cdk bootstrap aws://<AWS_ACCOUNT_ID>/ap-southeast-2
```

## 编译及部署AWS资源

在 `infra` 目录下运行以下命令

```
npm run build-deploy
```

