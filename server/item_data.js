item = new Object;
item.action = new Object;
item.action.default = 0;
item.action.equipable = 1;
item.action.consumable = 2;

item.blueprint = new Object;
item.blueprint.empty = new lostking.item_default_blueprint(0, "Empty", 1, 0);
item.blueprint.test = new lostking.item_default_blueprint(1, "Test", 2, 0);