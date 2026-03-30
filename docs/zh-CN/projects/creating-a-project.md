Envie 会把不同环境组织在项目之下。比如你可以为每一个 Git 仓库建立一个项目。

创建项目之前，先决定它要归属于哪个组织。

运行下面的命令，列出你当前可用的组织：

```bash
envie organization list
```

然后运行下面的命令创建一个新项目：

```bash
envie project create <organization-name>:<project-name>
```

有了项目之后，你就可以创建第一个环境了。
