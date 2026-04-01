### 环境版本与回滚

每次更新环境时，都会生成一个新版本。你可以通过下面的命令查看环境版本历史，以及是谁做了修改：

```bash
envie environment audit <organization>:<project>:<environment-name>
```

如果你想恢复到某个已有版本，可以运行：

```bash
envie environment rollback <organization>:<project>:<environment-name> <version-number>
```

这会基于指定的历史版本内容，创建一个新的环境版本。
