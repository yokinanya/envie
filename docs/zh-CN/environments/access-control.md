如果你希望其他用户能够查看或编辑你创建的环境，就必须通过 `environment set-access` 显式授予权限：

```bash
envie environment set-access <environment-path> <user-or-token>
```

你也可以通过 `--expiry` 参数为这份权限设置有效期。

如果你希望对方可以编辑环境，请加上 `--write` 参数。

你邀请的用户还必须属于该环境所属项目所在的组织。
更多说明请参见 [组织角色](/guide/zh-CN/organizations)。
