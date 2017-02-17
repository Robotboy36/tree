# tree
依赖jq， 树目录插件

## 使用方式
`$.lsTree( option );`

option 为参数
```
  option = {
  	// 容器
		el: opt.el || document.body || document.documentContent,
		
		// 数据
		data: [],
		
		// 是否有复选框
		hasCheckBox: false,
		
		// 根目录默认状态， 0：关闭， 1：展开根节点， 2:展开所有节点
		treeState: 0,  

		// 单击事件
		onClick: function( target ){}
  }
```

