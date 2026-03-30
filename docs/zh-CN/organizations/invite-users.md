你可以通过创建邀请链接，把新用户加入组织：

```bash
envie organization invite <organization-name> --expiry 1d --one-time
```

如果你希望同一个链接可以邀请多个人，就不要加 `--one-time`。

命令会输出一个链接，你可以把它分享给团队成员。

通过这个链接加入的用户，默认只拥有最小权限。
你可以使用 `organization set-access` 调整权限，例如：

```bash
envie organization set-access <organization-name> <user> \
--add-members=false \
--create-environments=true \
--create-projects=false \
--edit-project=true \
--edit-organization=false \
```

你仍然需要显式授予用户对环境的访问权限。参见 [环境访问控制](/guide/zh-CN/environments/access-control)。
