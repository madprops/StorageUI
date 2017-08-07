/* StorageUI v2.1.3 https://github.com/madprops/StorageUI */

var StorageUI = function(params)
{
	var instance = {};

	instance.params = params;

	check_params();

	function check_params()
	{
		if(instance.params.msg === undefined)
		{
			throw "No Msg instance was passed.";
		}

		if(instance.params.view_in_menu === undefined)
		{
			instance.params.view_in_menu = true;
		}

		if(instance.params.reset_in_menu === undefined)
		{
			instance.params.reset_in_menu = true;
		}

		if(instance.params.after_reset === undefined)
		{
			instance.params.after_reset = function(){};
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

	instance.menu = function()
	{
		if(!params.view_in_menu && !params.reset_in_menu)
		{
			return;
		}

		var s = "";

		var style = "";

		style += "color:#153c50;";
		style += "font-size:1.4em;";
		style += "cursor:pointer;";
		style += "user-select:none";

		if(instance.params.view_in_menu)
		{
			s += "<span class='StorageUI-menu-item' style='" + style + "'id='StorageUI-get-data'>View Data</span><br><br><br>";
		}

		if(instance.params.reset_in_menu)
		{
			s += "<span class='StorageUI-menu-item' style='" + style + "'id='StorageUI-reset-data'>Reset Data</span><br><br><br>";
		}

		s = s.replace(/[<br>]+$/g, '');

		instance.params.msg.show(s);

		if(instance.params.view_in_menu)
		{
			var get_data = document.getElementById('StorageUI-get-data');

			get_data.addEventListener("click", function()
			{
				instance.view(false);
			});
		}

		if(instance.params.reset_in_menu)
		{
			var reset_data = document.getElementById('StorageUI-reset-data');

			reset_data.addEventListener("click", function()
			{
				instance.reset(false);
			});
		}
	}

	instance.view = function(show=true)
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
		style2 += "cursor: pointer;";
		style2 += "user-select: none";

		var s = "";

		for(var i=0; i<instance.params.items.length; i++)
		{
			var item = instance.params.items[i];

			if(!item.show_in_view)
			{
				continue;
			}

			s += item.name + "<br>";
			s += "<textarea rows='5' class='StorageUI-area' style='" + style1 + "' id='StorageUI-area-" + i + "'></textarea><br>";
			s += "<span class='StorageUI-click-item' style='" + style2 + "' id='StorageUI-copy-" + i + "'>Copy To Clipboard</span>";
			s += "&nbsp; | &nbsp;<span class='StorageUI-click-item' style='" + style2 + "' id='StorageUI-select-" + i + "'>Select All</span>";
			s += "&nbsp; | &nbsp;<span class='StorageUI-click-item' style='" + style2 + "' id='StorageUI-save-" + i + "'>Save Modification</span>";
			s += "<br><br><br>";
		}

		s = s.replace(/[<br>]+$/g, '');

		if(show)
		{
			instance.params.msg.show(s);
		}

		else
		{
			instance.params.msg.set(s);
		}

		for(var i=0; i<instance.params.items.length; i++)
		{
			var item = instance.params.items[i];

			if(!item.show_in_view)
			{
				continue;
			}

			var area = document.getElementById('StorageUI-area-' + i);
			var clipboard = document.getElementById('StorageUI-copy-' + i);
			var select = document.getElementById('StorageUI-select-' + i);
			var save = document.getElementById('StorageUI-save-' + i);
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

	instance.reset = function(show=true)
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
			s += "<input type='checkbox' class='StorageUI-checkbox' style='width:2em;height:2em" + "' id='StorageUI-checkbox-" + i + "'><br><br><br>";
		}

		s += "<span class='StorageUI-reset-btn' style='color:#153c50;font-size:1.4em;cursor:pointer;user-select:none' id='StorageUI-reset'>Reset Selected</span>";

		if(show)
		{
			instance.params.msg.show(s);
		}

		else
		{
			instance.params.msg.set(s);
		}

		var reset = document.getElementById('StorageUI-reset');

		reset.addEventListener("click", function()
		{
			var resetted_items = [];

			for(var i=0; i<instance.params.items.length; i++)
			{
				var item = instance.params.items[i];

				if(!item.show_in_reset)
				{
					continue;
				}

				if(document.getElementById("StorageUI-checkbox-" + i).checked)
				{
					item.on_reset({name:item.name, ls_name:item.ls_name});
					resetted_items.push({name:item.name, ls_name:item.ls_name});
				}
			}

			instance.params.after_reset(resetted_items);

			instance.params.msg.close();
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

	return instance;
}