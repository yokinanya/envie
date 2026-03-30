<div align="center">

<img src="./logo.png" alt="Envie" width="120">

*让你的 secrets 和环境变量保持安全、有序、易管理。*

[English](./README.md)

</div>

Envie 既是一个面向生产环境的 secret manager，也是一个用于更好管理环境变量的开发工具。它可以帮助你摆脱本地 `.env` 文件，让开发机更整洁，也更安全。

### 特性

- **始终加密**  
环境变量会在传输前完成加密，服务端永远看不到明文

- **细粒度访问控制**  
可以按用户为特定环境授权，并支持设置访问期限

- **版本历史**  
跟踪环境配置随时间的变化，支持回滚并查看审计记录

- **变量组**  
使用共享的访问控制规则对环境变量进行分组和组织

- **多租户组织**  
支持面向团队的基于角色权限管理


### Roadmap

○ [**Web UI**](https://github.com/ilmari-h/envie/discussions/7)  
│ 通过浏览器界面管理环境  
│  
○ [**Deployment Automation**](https://github.com/ilmari-h/envie/discussions/5)  
│ 在环境变量更新时触发部署  
│  

欢迎在 [discussions](https://github.com/ilmari-h/envie/discussions) 中提出功能建议并参与路线图讨论。

## 📦 安装

Envie 以 CLI 工具的形式发布在 npm 上。

全局安装命令如下：

```bash
npm install -g @envie/cli
```

要求：Node.js `v22.0+`，以及 Linux 或 macOS 操作系统。

## 🚀 快速开始
> [!IMPORTANT]  
> 使用 Envie 之前，你需要在本机准备一个 Ed25519 密钥对。因为 Envie 使用客户端加密来保护你的环境变量。
>
> 你可以通过下面的 OpenSSH 命令生成：
>
> ```bash
> ssh-keygen -t ed25519
> ```

第一次使用 Envie 时，直接运行不带参数的 `envie`，会进入初始化向导。

这个向导会帮助你完成初始配置，例如设置密钥路径和终端自动补全。

完成初始化后，可以通过下面的命令登录：

```bash
envie login
```

现在你已经可以开始使用 Envie 了。

### 创建项目

Envie 会将不同环境组织在项目之下。

**示例：** Acme 公司有两个项目：Web Dashboard 和一个 REST API。

首先，Acme 的开发者创建一个名为 *acme* 的组织：

```bash
envie organization create acme
```

> [!TIP]  
> 如果你使用的是 Envie Cloud 的免费套餐，也可以直接使用你的个人组织，而不必手动创建新的组织。
>
> 可以通过下面的命令查看个人组织名称：
>
> ```bash
> envie organization list
> ```

接下来，为 Web Dashboard 和 API 创建项目：

```bash
envie project create acme:web-dashboard && \
envie project create acme:rest-api
```

你可以通过下面的命令查看 `acme` 组织下的所有项目：

```bash
envie project list --organization acme
```

### 用 Envie 环境替代本地 `.env` 文件

你可以使用 Envie 环境来管理环境变量，而不再依赖本地的 `.env` 文件。

在同一个项目下面，你可以创建任意多个环境。例如：用于生产的 `prod`、用于预发布的 `staging`，以及某位开发者自己的 `josh-dev`。
这些环境都可以拥有不同的访问控制规则。

你可以基于磁盘上的现有 `.env` 文件创建一个环境：

```bash
envie environment create <organization>:<project>:<environment-name> --file <path-to-env-file>
```

如果环境已经存在，也可以直接用 `.env` 文件内容更新它：

```bash
envie environment update <organization>:<project>:<environment-name> <path-to-env-file>
```

你也可以一次更新一个环境变量：

```bash
# 设置字面量值
envie set <organization>:<project>:<environment-name> KEY=value

# 从另一个环境克隆同名 key
envie set <organization>:<project>:<environment-name> KEY --from org:project:other-env

# 克隆并重命名（把 SOURCE_KEY 复制成 KEY）
envie set <organization>:<project>:<environment-name> KEY=SOURCE_KEY --from org:project:other-env

# 一次克隆多个 key
envie set <organization>:<project>:<environment-name> API_KEY DB_URL --from org:project:staging

# 混合使用克隆和重命名
envie set <organization>:<project>:<environment-name> PUBLIC_KEY=PRIVATE_KEY API_SECRET --from org:project:prod
```

删除某个环境变量：

```bash
envie unset <org>:<project>:<env-name> KEY
```

### 使用环境

你不再需要手动 source 本地 `.env` 文件，而是可以直接通过 Envie 为命令注入环境变量。

执行命令时加载指定环境：

```bash
envie exec <organization>:<project>:<environment-name> ./your-command.sh

# 或指定某个版本
envie exec <organization>:<project>:<environment-name>@version ./your-command.sh

# 或者不传命令，直接启动交互式 shell
envie exec <organization>:<project>:<environment-name>

# 使用 -- 向被执行命令传参
envie exec <organization>:<project>:<environment-name>@version npm -- run dev
```

### 使用 `envierc.json` 做工作区配置

你可以在项目目录中添加一个 `envierc.json`，作为项目级的 Envie 配置文件。

`envierc.json` 示例：

```json
{
  "organizationName": "acme",
  "projectName": "acme-web-application",
  "instanceUrl": "https://api.example.com"
}
```

如果你在包含 `envierc.json` 的目录下运行命令，例如 `envie exec`，就不必再输入完整环境路径。比如原本需要写 `acme:acme-web-application:dev`，现在只写 `dev` 就够了。

### 使用 `.envie` 为不同开发者指定不同开发环境

如果同一个项目有多个开发者，每个人都可以通过 `.envie` 文件指定自己的默认开发环境。

把 `.envie` 放在项目根目录，并将它加入 `.gitignore`。

在文件中写入你的开发环境，例如：`acme-corp:project-name:joshs-dev-env`。

这样，当你执行类似下面的命令时：

```bash
envie exec default ./some-command.sh
```

Envie 会从开发者本地的 `.envie` 文件里读取默认环境名。

### 与 `package.json` 配合使用的示例

Envie 很容易接入现有开发流程。
例如，你可以在一个 Web 项目里把 Envie 和 `package.json` 脚本配合起来：

1. 在项目根目录创建 `envierc.json`
2. 在 `.envie` 中指定你自己的默认开发环境
3. 在 `package.json` 里给开发脚本加上 `envie exec`

```json
{
  "name": "my-project",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "npx with-env next build",
    "dev": "npx with-env next dev --turbo",
    "start": "npx with-env next start",
    "with-env": "envie exec default --"
  },
  "dependencies": {
    /*...*/
  }
}
```

之后运行 `npm run dev` 之类的命令时，就会自动带上你指定的环境变量。

## 配置

Envie 的配置可以通过 CLI 管理，详见 `envie config` 相关子命令。

本地配置也可以保存在标准配置目录下的 `config.json` 文件中：

- Linux: `XDG_CONFIG_HOME/envie`
- macOS: `~/Library/Application Support/envie`

你也可以通过环境变量 `ENVIE_CONFIG_DIRECTORY` 覆盖默认配置目录。

## 自托管
> [!TIP]  
> 如果你不想自己部署，也可以体验原始项目提供的托管服务 Envie Cloud：个人使用永久免费，团队也有相对实惠的按用户计费方案。
>
> 可以前往 <https://envie.cloud> 开始使用。

Envie 支持使用 Docker 进行自托管，需要两个镜像：

- **API**: [yokinanya/envie-api](https://hub.docker.com/r/yokinanya/envie-api)
- **Web client**: [yokinanya/envie-web](https://hub.docker.com/r/yokinanya/envie-web)

镜像使用方式见 Docker Hub 说明，部署细节可参考 [docs/zh-CN/self-hosting/host-with-docker.md](./docs/zh-CN/self-hosting/host-with-docker.md)。

## 安全实践

Envie 使用公钥加密，确保你的环境变量始终保持私密和安全。

### 工作原理

- **客户端加密** - 环境变量会先在你的设备上加密，再发送出去
- **公钥加密** - 使用现代密码学机制，只有被授权的人才能解密数据
- **零知识服务端** - 服务端只存储密文，无法看到真实环境变量

### 访问控制

- **细粒度权限** - 可以按环境授权，而不是只能按整个项目授权
- **基于角色的访问** - 组织管理员可以控制谁能创建项目和环境
- **显式授权** - 用户必须被明确授予访问权限，才能访问某个环境
- **限时访问** - 可以在指定时间后自动撤销访问权限

## 致谢

这个仓库基于原始项目 [ilmari-h/envie](https://github.com/ilmari-h/envie) 演进而来。
感谢原项目作者和所有贡献者打下的基础，让这套自托管改造能够继续推进。
