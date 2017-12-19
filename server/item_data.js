item = new Object;
item.action = new Object;
item.action.default = 0;
item.action.equipable = 1;
item.action.consumable = 2;

item.blueprint = new Object;
item.blueprint.empty = new lostking.item_default_blueprint(0, "Empty", 1, 0);
item.blueprint.test = new lostking.item_default_blueprint(1, "Test", 2, 0);
item.blueprint.sword = new lostking.item_equipable_blueprint(2, "Sword", 1, 0, equipment.item.mainhand, 100);
item.blueprint.helmet = new lostking.item_equipable_blueprint(3, "Helmet", 1, 0, equipment.item.helmet, 100);
item.blueprint.master_sword = new lostking.item_equipable_blueprint(4, "Master Sword", 2, 0, equipment.item.mainhand, 100);
item.blueprint.ring_silver = new lostking.item_equipable_blueprint(5, "Ring Silver", 1, 0, equipment.item.ring, 100);
item.blueprint.ring_gold = new lostking.item_equipable_blueprint(5, "Ring Gold", 1, 0, equipment.item.ring, 100);