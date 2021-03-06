import can from "can";
import stache from "can/view/stache/";
import util from "./util";
import tabsStache from "./tabs.stache!";
import panelStache from "./panel.stache!";
import "./tabs.less!";

export var CanPanelVM = can.Map.extend({
	active: false
});

can.Component.extend({
	tag:"can-panel",
	template: panelStache,
	scope: CanPanelVM,
	events: {
		inserted: function(){
			this.element.parent().scope().addPanel( this.scope );
		},
		removed: function(){
			this.element.parent().scope().removePanel( this.scope );
		}
	}
});

export var CanTabsVM = can.Map.extend({
	// Contains a list of all panel scopes within the
	// tabs element.
	panels: [],
	// When a `<panel>` element is inserted into the document,
	// it calls this method to add the panel's scope to the
	// panels array.
	addPanel: function(panel){
		// If this is the first panel, activate it.
		if( this.attr("panels").length === 0 ) {
			this.makeActive(panel);
		} 
		this.attr("panels").push(panel);
	},
	// When a `<panel>` element is removed from the document,
	// it calls this method to remove the panel's scope from
	// the panels array.
	removePanel: function(panel){
		var panels = this.attr("panels");
		can.batch.start();
		panels.splice(panels.indexOf(panel),1);
		// if the panel was active, make the first item active
		if(panel === this.attr("active")){
			if(panels.length){
				this.makeActive(panels[0]);
			} else {
				this.removeAttr("active")
			}
		}
		can.batch.stop()
	},
	makeActive: function(panel){
		this.attr("active",panel);
		this.attr("panels").each(function(panel){
			panel.attr("active", false)
		});
		panel.attr("active",true);
		
	},
	// this is scope, not mustache
	// consider removing scope as arg
	isActive: function( panel ) {
		return this.attr('active') == panel;
	}
});

can.Component.extend({
	tag: "bit-tabs",
	template: tabsStache,
	scope: CanTabsVM
});


