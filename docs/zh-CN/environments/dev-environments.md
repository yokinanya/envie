### 通过 `.envie` 文件为不同开发者使用不同环境

当一个项目有多个开发者协作时，每个人都可以通过 `.envie` 文件指定自己的开发环境。

把 `.envie` 文件放在项目根目录，并把它加入 `.gitignore`。

在文件里写入你的开发环境，例如 `organization:project:staging`。

这样当你使用 `envie exec` 并把环境参数写成 `default` 时，例如 `envie exec default ./some-command.sh`，

Envie 就会从开发者自己的 `.envie` 文件中读取环境名称。

### 示例：在 Web 开发项目中使用 Envie

你可以很容易把 Envie 集成到任何开发流程里。
例如，下面展示了如何在一个 Web 开发项目里，把 Envie 和 `package.json` 中的脚本一起使用。

1. 在项目根目录创建一个 `envierc.json` 文件（关于 `envierc.json` 的更多信息，请参见 [工作区配置](/guide/zh-CN/configuration/workspaces)）。

2. 在 `.envie` 文件中写入你个人默认的开发环境。

3. 在 `package.json` 的开发脚本前面加上 `envie exec`，例如：

```json
{
  "name": "my-project",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "npx with-env next dev",
    "other-dev-command": "npx with-env some-script",
    "with-env": "envie exec default --"
  },
  "dependencies": {
    /*...*/
  }
}
```

现在当你运行例如 `npm run dev` 时，这个示例 Next.js 项目就会带着你指定的环境启动。
