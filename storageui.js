/*storageUI Version 1.2.0*/

var storageUI = function(params)
{
	var instance = {};

	instance.params = params;

	check_params();

	function check_params()
	{
		if(instance.params.view_in_menu === undefined)
		{
			instance.params.view_in_menu = true;
		}

		if(instance.params.reset_in_menu === undefined)
		{
			instance.params.reset_in_menu = true;
		}

		for(var i=0; i<instance.params.items.length; i++)
		{
			var item = instance.params.items[i];

			if(item.show_in_view === undefined)
			{
				item.show_in_view = true;
			}

			if(item.show_in_reset === undefined)
			{
				item.show_in_reset = true;
			}

			if(item.on_save === undefined)
			{
				item.on_save = function(){};
			}

			if(item.on_reset === undefined)
			{
				item.on_reset = function(){};
			}

			if(item.on_copied === undefined)
			{
				item.on_copied = function(){};
			}

			if(item.on_selected === undefined)
			{
				item.on_selected = function(){};
			}

			if(item.name === undefined)
			{
				item.name = "Undefined Name";
			}

			if(item.ls_name === undefined)
			{
				item.ls_name = "Undefined ls_name";
			}
		}
	}

	instance.close = function()
	{
		var overlay = document.getElementById('storageui-overlay');
		var msg = document.getElementById('storageui-msg');
		msg.style.display = 'none';
		overlay.style.display = 'none';
	}

	instance.msg = function(html)
	{
		var msg = document.getElementById('storageui-msg');

		if(msg === null)
		{
			instance.create();
			msg = document.getElementById('storageui-msg');
		}

		var overlay = document.getElementById('storageui-overlay');

		msg.innerHTML = html;
		msg.style.display = 'block';
		overlay.style.display = 'block';
		msg.focus();
	}

	instance.create = function()
	{
		var style1 = "";

		style1 += "color: black;";
		style1 += "font-size: 23.8px;";
		style1 += "font-family: sans-serif;";
		style1 += "text-align: center;";
		style1 += "position: fixed;";
		style1 += "left: 50%;";
		style1 += "top: 50%;";
		style1 += "transform: translate(-50%, -50%);";
		style1 += "background: white;";
		style1 += "padding: 1.6em;";
		style1 += "overflow: auto;";
		style1 += "max-height: 80vh;";
		style1 += "overflow-x: hidden;";
		style1 += "overflow-y: auto;";
		style1 += "display: block;";
		style1 += "z-index: 499399259;";
		style1 += "outline: 0";

		var style2 = "";

		style2 += "height: 100%;";
		style2 += "width: 100%;";
		style2 += "top: 0;";
		style2 += "left: 0;";
		style2 += "position: fixed;";
		style2 += "z-index: 49939959;";
		style2 += "background-color: rgba(0, 0, 0, 0.7);";
		style2 += "display: block";

		var overlay_html = "<div style='" + style2 + "' id='storageui-overlay'></div>";
		var msg_html = "<div style='" + style1 + "' id='storageui-msg'></div>";

		document.body.insertAdjacentHTML('beforeend', overlay_html);
		document.body.insertAdjacentHTML('beforeend', msg_html);

		var overlay = document.getElementById('storageui-overlay');

		overlay.addEventListener("click", function()
		{
			instance.close();
		});		
	}

	instance.menu = function()
	{
		if(!params.view_in_menu && !params.reset_in_menu)
		{
			return;
		}

		var s = "";

		if(instance.params.view_in_menu)
		{
			s += "<span class='storageui-menu-item' style='color:#153c50;font-size:1.4em;cursor:pointer'id='storageui-get-data'>View Data</span><br><br><br>";
		}

		if(instance.params.reset_in_menu)
		{
			s += "<span class='storageui-menu-item' style='color:#153c50;font-size:1.4em;cursor:pointer'id='storageui-reset-data'>Reset Data</span><br><br><br>";
		}

		s = s.replace(/[<br>]+$/g, '');

		instance.msg(s);

		if(instance.params.view_in_menu)
		{
			var get_data = document.getElementById('storageui-get-data');

			get_data.addEventListener("click", function()
			{
				instance.view();
			});
		}

		if(instance.params.reset_in_menu)
		{
			var reset_data = document.getElementById('storageui-reset-data');

			reset_data.addEventListener("click", function()
			{
				instance.reset();
			});
		}
	}

	instance.view = function()
	{
		var style1 = "";

		style1 += "margin-top: 0.2em;";
		style1 += "margin-bottom: 0.2em;";
		style1 += "font-size: 0.9em;"	;
		style1 += "width: 25em;";
		style1 += "border: 0.05em solid;";
		style1 += "padding: 0.2em;";
		style1 += "outline: none;";
		style1 += "letter-spacing: 0.06em;";
		style1 += "word-spacing: 0.06em";

		var style2 = "";

		style2 += "padding-top: 0.1em;";
		style2 += "font-size: 0.9em;";
		style2 += "cursor: pointer";

		var s = "";

		for(var i=0; i<instance.params.items.length; i++)
		{
			var item = instance.params.items[i];

			if(!item.show_in_view)
			{
				continue;
			}

			s += item.name + "<br>";
			s += "<textarea rows='5' class='storageui-area' style='" + style1 + "' id='storageui-area-" + i + "'></textarea><br>";
			s += "<span class='storageui-click-item' style='" + style2 + "' id='storageui-copy-" + i + "'>Copy To Clipboard</span>";
			s += "&nbsp; | &nbsp;<span class='storageui-click-item' style='" + style2 + "' id='storageui-select-" + i + "'>Select All</span>";
			s += "&nbsp; | &nbsp;<span class='storageui-click-item' style='" + style2 + "' id='storageui-save-" + i + "'>Save Modification</span>";
			s += "<br><br><br>";
		}

		s = s.replace(/[<br>]+$/g, '');

		instance.msg(s);

		for(var i=0; i<instance.params.items.length; i++)
		{
			var item = instance.params.items[i];

			if(!item.show_in_view)
			{
				continue;
			}

			var area = document.getElementById('storageui-area-' + i);
			var clipboard = document.getElementById('storageui-copy-' + i);
			var select = document.getElementById('storageui-select-' + i);
			var save = document.getElementById('storageui-save-' + i);
			var ls = localStorage.getItem(item.ls_name);

			area.value = ls;

			clipboard.addEventListener("click", function(item, area)
			{
				return function(){copy_func(item, area)};
			}(item, area));

			save.addEventListener("click", function(item, area)
			{
				return function(){save_func(item, area)};
			}(item, area));

			select.addEventListener("click", function(item, area)
			{
				return function(){select_func(item, area)};
			}(item, area));
		}

		function copy_func(item, area)
		{
			instance.copy(area.value);
			item.on_copied({name:item.name, ls_name:item.ls_name, value:area.value});
		}

		function save_func(item, area)
		{
			item.on_save({name:item.name, ls_name:item.ls_name, value:area.value});
		}

		function select_func(item, area)
		{
			area.select();
			item.on_selected({name:item.name, ls_name:item.ls_name, value:area.value});			
		}	
	}

	instance.reset = function()
	{
		var s = "";

		for(var i=0; i<instance.params.items.length; i++)
		{
			var item = instance.params.items[i];

			if(!item.show_in_reset)
			{
				continue;
			}

			s += item.name + "<br><br>";
			s += "<input type='checkbox' class='storageui-checkbox' style='width:2em;height:2em" + "' id='storageui-checkbox-" + i + "'><br><br><br>";
		}

		s += "<span class='storageui-reset-btn' style='color:#153c50;font-size:1.4em;cursor:pointer' id='storageui-reset'>Reset Selected</span>";

		instance.msg(s);

		var reset = document.getElementById('storageui-reset');

		reset.addEventListener("click", function()
		{	
			for(var i=0; i<instance.params.items.length; i++)
			{
				var item = instance.params.items[i];

				if(!item.show_in_reset)
				{
					continue;
				}

				if(document.getElementById("storageui-checkbox-" + i).checked)
				{
					item.on_reset({name:item.name, ls_name:item.ls_name});
				}
			}

			instance.close();
		});
	}	

	instance.copy = function(s)
	{
		var textareaEl = document.createElement('textarea');
		document.body.appendChild(textareaEl);
		textareaEl.value = s;
		textareaEl.select();
		document.execCommand('copy');
		document.body.removeChild(textareaEl);		
	}

	instance.is_open = function()
	{
		var msg = document.getElementById('storageui-msg');

		if(msg === null || msg.style.display === 'none')
		{
			return false;
		}

		else
		{
			return true;
		}
	}

	return instance;
}