你可以通过在 Git 目录中添加 `envierc.json` 文件，为 Envie 创建一份工作区级配置。

下面是一个 `envierc.json` 的示例：

```json
{
  "organizationName": "acme",
  "projectName": "acme-web-application",
  "instanceUrl": "https://api.envie.cloud"
}
```

当你在包含 `envierc.json` 的目录里运行命令时，例如 `envie exec`，就不需要再写完整的环境路径。

例如，原本需要这样写：

```bash
envie exec acme:acme-web-application:dev
```

现在可以简化为：

```bash
envie exec dev
```
