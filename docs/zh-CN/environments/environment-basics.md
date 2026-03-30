在 Envie 中，你可以把环境变量、API Key、数据库凭证以及其他应用密钥存放在 *environment* 里。

同一个项目下面可以有多个不同的环境。
例如，一个叫 `prod` 用于生产部署，一个叫 `staging` 用于预发布，还有一个叫 `dev-josh` 用作 Josh 的个人开发环境。
这些环境都可以拥有不同的访问控制规则，后面会讲到。

### 创建环境

你可以使用下面的命令创建环境：

```bash
envie environment create <organization>:<project>:<environment-name> KEY1=VALUE1 KEY2=VALUE2
```

你也可以直接从已有的 `.env` 文件创建：

```bash
envie environment create <organization>:<project>:<environment-name> --file ./path/to/.env
```

### 查看环境

要查看环境信息，运行：

```bash
envie environment show <organization>:<project>:<environment-name>
```

你会看到类似下面的输出：

```
╭─── your-environment (3 variables)
│ VAR1=<encrypted>
│ VAR2=<encrypted>
│ VAR3=<encrypted>
╰──────────────────────────────────
```

默认情况下，变量值会显示为 `<encrypted>`。如果你确实想查看明文值，可以加上 `--unsafe-decrypt` 参数。**注意**：不要在生产环境中使用这个选项。关于环境的推荐使用方式，请参见 [使用环境](/guide/zh-CN/environments/using-environments)。
