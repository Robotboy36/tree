
/**
 * tools
 * */
$.tools = {		
	format: function( str, data ){			
		var matchs = str.match(/{[^}]+?}/g);	
		var maLen = matchs.length;

		data = data instanceof Array ? data : [data];	
		
		var html = '';
		for( var n=0, len=data.length; n<len; n++ ){
			var obj = data[n];
			if( typeof obj.className === "undefined" ){
				obj.className = "";
			}

			var temp = str;
			for( var i=0; i<maLen; i++ ){				
				var match = matchs[i];
				var name = match.replace(/{|}/g, "");
				temp = temp.replace( match, obj[name] );
			}

			html += temp;
		}		
		
		return html;
	}
}



/***
* Tree
*/
$.lsTree = function( opt ){

	var _default = {
		
		// 容器
		el: opt.el || document.body || document.documentContent,
		
		// 数据
		data: [],
		
		// 是否有复选框
		hasCheckBox: false,
		
		// 根目录默认状态， 0：关闭， 1：展开根节点， 2:展开所有节点
		treeState: 0,  

		// 单击事件
		onClick: function(){}
	};
	
	$.lsTree.opts = $.extend( _default, opt || {} );
	

	var el = $.lsTree.opts.el;
	$.lsTree.opts.el = typeof el === 'string' || !el.size ? $(el) : el;

	//tree template
	$.lsTree.template = 
		'<ul class="{stateClass}">' +
		'{stateFlag}' + 
		'<li>' +
		'	{checkbox}<label class="tree-title" data-id="{id}" data-pid="{pid}">{name}</label>' + 
		'	{childrens}' + 
		'</li>' +
		'</ul>';


	$.lsTree.init();
}


/** add style */
$.lsTree.addLink = function(){
	var linkEl = $('<link rel="stylesheet" type="text/css" href="./lstree.css" />');
	
	linkEl.on( 'load', this.buildTree.bind(this) );	
	$('head').append( linkEl );
}


// init tree
$.lsTree.init = function(){
	this.addLink();
}


// build tree
$.lsTree.buildTree = function(){
	var el = this.opts.el;

	var list = '<div lstree>' + this.createTree() + '</div>';
	el.html( list );
	this.event();
}


// lookup children
$.lsTree.createTree = function( obj ){

	var treeState = this.opts.treeState;
	var template = this.template;
	var isRoot = typeof obj === 'undefined' ? 1 : 0;

	obj = obj || data[0];
	var childs = obj.childs;
	var hasChild = childs && childs.length;


	var childList = '';
	// build children list
	if( hasChild ){
		for( var i=0, len=childs.length; i<len; i++ ){
			childList += this.createTree( childs[i] );
		}
	}

	var param = {		
		stateClass: treeState===1 && isRoot || treeState === 2 ? 'tree-open' : '',
		stateFlag: hasChild ? '<span class="state-flag"></span>' : '',
		checkbox: this.opts.hasCheckBox ? '<label data-id="{' + obj.id + '}" class="checkbox"></label>' : '',

		id: obj.id,
		pid: obj.pid,
		name: obj.name,
		childrens: childList
	}

	return $.tools.format(template, param);
}


// event bind
$.lsTree.event = function(){
	var el = this.opts.el;
	var _this = this;

	el.on('click', '.state-flag,.tree-title', onItemClick);
	el.on('click', '.checkbox', onCheckBox);


	function onItemClick(e){
		e = e || window.event;
		var target = $(e.target || e.srcElement);
		var list = target.closest('ul');
		list.toggleClass('tree-open');

		_this.opts.onClick && _this.opts.onClick(target);
	}


	function onCheckBox(e){
		e = e || window.event;
		var target = $(e.target || e.srcElement);

		if( target.hasClass("checked") || target.hasClass("half-checked") ){//选中状态，取消选择
			target.removeClass("checked")
			target.removeClass("half-checked")

			// set parents checked
			var pChecks = target.parents('li').children(".checkbox");
			pChecks.each(function(){
				var ck = $(this);

				if( ck.hasClass("checked") ){
					ck.removeClass('checked').addClass('half-checked');
				}
			});


			// set childrens checked
			var cChecks = target.closest('ul').find(".checkbox");
			cChecks.removeClass("checked");
			cChecks.removeClass("half-checked");

		}else{
			target.addClass("checked");
			target.closest('ul').find(".checkbox").addClass("checked");
		}


		// check current list all checked or cancel
		_this.lookupParentChecked( target );
	}
}


// check all state
$.lsTree.lookupParentChecked = function( target ){
	var parent = target.closest('ul').parent();
	var cChecks = parent.find('ul').find(".checkbox");
	var len = cChecks.size();

	if( !len ){
		return;
	}

	var checked = 0;
	cChecks.each(function(){
		var ck = $(this);
		ck.hasClass("checked") && ++checked;
	});


	var pck = parent.children(".checkbox");
	if( checked == len ){	

		pck.removeClass('half-checked').addClass('checked');
	}else if( checked != 0 ){

		pck.addClass('half-checked');
	}else{

		pck.removeClass('half-checked').removeClass('checked');
	}


	//recursion check
	this.lookupParentChecked( pck );
}

