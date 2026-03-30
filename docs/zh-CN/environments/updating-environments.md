> *注意*：只有被授予环境 *write* 权限的用户才能更新环境。
> 参见 [访问控制](/guide/zh-CN/environments/access-control)。

你可以使用下面的命令设置环境变量的值：

```bash
# 直接设置字面量值
envie set <organization>:<project>:<environment-name> KEY=value
```

你也可以通过 `--from` 从另一个环境复制变量值：

```bash
# 从另一个环境复制同名键
envie set <organization>:<project>:<environment-name> KEY --from org:project:other-env

# 复制并重映射（把 other-env 的 SOURCE_KEY 复制为当前环境的 KEY）
envie set <organization>:<project>:<environment-name> KEY=SOURCE_KEY --from org:project:other-env

# 一次复制多个键
envie set <organization>:<project>:<environment-name> API_KEY DB_URL SECRET --from org:project:staging

# 在同一个命令里混合复制与重映射
envie set <organization>:<project>:<environment-name> PUBLIC_KEY=PRIVATE_KEY API_SECRET=API_KEY --from org:project:prod
```

要删除环境变量，运行：

```bash
envie unset <org>:<project>:<env-name> KEY
```

每次更新环境时，Envie 都会创建一个新的环境版本，以保留版本历史。
