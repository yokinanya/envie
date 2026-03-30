### 使用你的环境

Envie 允许你通过 `exec` 命令使用环境。
`exec` 会在加载好环境变量后启动一个新的 shell，并执行作为第二个参数传入的命令。

```bash
envie exec <organization>:<project>:<environment-name> ./your-command.sh

# 或者指定某个版本
envie exec <organization>:<project>:<environment-name>@version ./your-command.sh

# 或者不传命令，直接进入交互式 shell
envie exec <organization>:<project>:<environment-name>

# 使用 -- 向目标命令继续传参
envie exec <organization>:<project>:<environment-name>@version npm -- run dev
```
