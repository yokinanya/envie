在生产环境中使用 Envie 的推荐方式是访问令牌认证。访问令牌允许你在不经过浏览器登录流程的情况下运行 CLI 命令。
这让你可以很方便地以编程方式调用 Envie，例如在 Dockerfile 或其他部署脚本中。

### 创建和使用访问令牌

使用下面的命令创建访问令牌：

```bash
envie access-token create <name> --expiry <1h/1d/etc>
```

请务必复制命令输出的令牌值并妥善保存，因为它只会显示这一次。

如果访问令牌需要使用某个环境，你必须显式授予它权限：

```bash
envie environment set-access <environment-path> <access-token-name>
```

之后，你就可以通过设置环境变量 `ENVIE_ACCESS_TOKEN` 来使用这个访问令牌。比如，你可以把这个环境变量传给 `docker run`，然后在 Dockerfile 中使用 Envie：

```Dockerfile
CMD ["envie", "exec", "organization:project:environment", "my-program.sh"]
```
