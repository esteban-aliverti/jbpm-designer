if (!ORYX.Plugins) 
    ORYX.Plugins = {};

if (!ORYX.Config)
	ORYX.Config = {};

ORYX.Plugins.LockNode = Clazz.extend({
	construct: function(facade){
		this.facade = facade;
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_LOADED, this.checkLocksOnLoad.bind(this));
		this.facade.offer({
			'name': 'Lock',
			'functionality': this.locknodes.bind(this),
			'group': 'lockunlockgroup',
			'icon': ORYX.PATH + "images/lock.png",
			'description': 'Lock Elements',
			'index': 1,
			'minShape': 1,
			'maxShape': 0,
			'isEnabled': function(){
				profileParamName = "profile";
				profileParamName = profileParamName.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
				regexSa = "[\\?&]"+profileParamName+"=([^&#]*)";
		        regexa = new RegExp( regexSa );
		        profileParams = regexa.exec( window.location.href );
		        profileParamValue = profileParams[1]; 
				return profileParamValue == "jbpm";
			}.bind(this)
		});
		this.facade.offer({
			'name': 'Unlock',
			'functionality': this.unlocknodes.bind(this),
			'group': 'lockunlockgroup',
			'icon': ORYX.PATH + "images/unlock.png",
			'description': 'Unlock Elements',
			'index': 2,
			'minShape': 1,
			'maxShape': 0,
			'isEnabled': function(){
				profileParamName = "profile";
				profileParamName = profileParamName.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
				regexSa = "[\\?&]"+profileParamName+"=([^&#]*)";
		        regexa = new RegExp( regexSa );
		        profileParams = regexa.exec( window.location.href );
		        profileParamValue = profileParams[1]; 
				return profileParamValue == "jbpm";
			}.bind(this)
		});
	},
	checkLocksOnLoad: function() {
		ORYX.EDITOR._canvas.getChildren().each((function(child) {
				this.applyLockingToChild(child);
		}).bind(this));
	},
	applyLockingToChild: function(child) {
		if(child && (child instanceof ORYX.Core.Node || child instanceof ORYX.Core.Edge) && child.properties["oryx-isselectable"] == "false") {
			child.setSelectable(false);
			child.setMovable(false);
			child.refresh();
		}
		if(child && child.getChildren().size() > 0) {
			for (var i = 0; i < child.getChildren().size(); i++) {
				this.applyLockingToChild(child.getChildren()[i]);
			}
		}
	},
    locknodes: function() {
    	var selection = this.facade.getSelection();
    	selection.each(function(shape) {
    		this.lockShape(shape);
    	}.bind(this));
        
    },
    unlocknodes: function() {
    	var selection = this.facade.getSelection();
    	selection.each(function(shape) {
    		this.unlockShape(shape);
    	}.bind(this));
    },
    unlockShape: function(shape) {
    	if(shape) {
	    	shape.setSelectable(true);
	    	shape.setMovable(true);
	    	if(shape instanceof ORYX.Core.Node || shape instanceof ORYX.Core.Edge) {
	    		shape.setProperty("oryx-bordercolor", shape.properties["oryx-origbordercolor"]);
	    		shape.setProperty("oryx-bgcolor", shape.properties["oryx-origbgcolor"]);
	    	}
	    	shape.setProperty("oryx-isselectable", "true");
	    	shape.refresh();
	    	if(shape.getChildren().size() > 0) {
				for (var i = 0; i < shape.getChildren().size(); i++) {
					if(shape.getChildren()[i] instanceof ORYX.Core.Node || shape.getChildren()[i] instanceof ORYX.Core.Edge) {
						this.unlockShape(shape.getChildren()[i]);
					}
				}
			}
    	}
    },
    lockShape: function(shape) {
    	if(shape) {
    		shape.setSelectable(false);
    		shape.setMovable(false);
    		if(shape instanceof ORYX.Core.Node || shape instanceof ORYX.Core.Edge) {
    			shape.setProperty("oryx-bordercolor", "#888888");
    			shape.setProperty("oryx-bgcolor", "#CCEEFF");
    		}
    		shape.setProperty("oryx-isselectable", "false");
    		shape.refresh();
    		if(shape.getChildren().size() > 0) {
				for (var i = 0; i < shape.getChildren().size(); i++) {
					if(shape.getChildren()[i] instanceof ORYX.Core.Node || shape.getChildren()[i] instanceof ORYX.Core.Edge) {
						this.lockShape(shape.getChildren()[i]);
					}
				}
			}
    	}
    }
});