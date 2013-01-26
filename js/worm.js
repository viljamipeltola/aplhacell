function Worm( o ) {
	if ( !o ) {
		o = {};
		o.x = 6;
		o.y = 14.7;
		o.r = 0.5;
		o.a = 2 * Math.PI;
	}
	// TODO: Angle
	var bottom = box2d.create.circle({r: o.r, x: o.x, y: o.y, static: true }),
	    middle = box2d.create.circle({r: o.r * 0.8, x: o.x, y: o.y - o.r, density: 0.8 }),
	    head = box2d.create.circle({r: o.r * 0.6, x: o.x, y: o.y - o.r * 2, density: 0.2 }),
	    djoint1 = box2d.create.distanceJoint({bodyA: bottom, bodyB: middle, centerA: bottom.GetPosition(), centerB: middle.GetPosition() }),
	    djoint2 = box2d.create.distanceJoint({bodyA: middle, bodyB: head, centerA: middle.GetPosition(), centerB: head.GetPosition() }),
	    rjoint1 = box2d.create.revoluteJoint({
			bodyA: bottom, 
			bodyB: middle, 
			centerA: bottom.GetPosition(), 
			centerB: middle.GetPosition(),
			lowerAngle: -0.02 * Math.PI,
			upperAngle: 0.02 * Math.PI 
		}),
		rjoint2 = box2d.create.revoluteJoint({
			bodyA: middle, 
			bodyB: head, 
			centerA: middle.GetPosition(), 
			centerB: head.GetPosition(),
			lowerAngle: -0.05 * Math.PI,
			upperAngle: 0.05 * Math.PI 
		});
	
	//box2d.create.distanceJoint({bodyA: middle, bodyB: head });
	//box2d.create.box({w:5, h: 1, x: 5, y: 5});
	
	this.bottom = bottom;
	this.middle = middle;
	this.head = head;
	
	this.imgs = {
		head: $('#wormHead').get(0),
		middle: $('#wormBody').get(0),
		bottom: $('#wormBody').get(0)
	}
}

Worm.prototype.imgs = {};

Worm.prototype.draw = function ( context ) {
	//console.log( this.head.GetPosition().x * box2d.scale, this.head.GetPosition().y * box2d.scale );
	// Draw Head
	context.save();
	context.translate(this.head.GetPosition().x * box2d.scale, this.head.GetPosition().y * box2d.scale ); 
	context.rotate(this.head.GetAngle() + 1.5 + Math.sin(game.gameTime*0.3));
	var s2 = 0.5;
	var scale = s2;
	context.scale(scale,scale);
	context.drawImage(this.imgs.head,-37,-37);
	context.restore();
	
	// Draw Middle
	context.save();
	context.translate(this.middle.GetPosition().x * box2d.scale, this.middle.GetPosition().y * box2d.scale ); 
	context.rotate(this.middle.GetAngle());
	var s2 = 0.4;
	var scale = s2;
	context.scale(scale,scale);
	context.drawImage(this.imgs.middle,-32,-32);
	context.restore();
	
	// Draw Bottom
	context.save();
	context.translate(this.bottom.GetPosition().x * box2d.scale, this.bottom.GetPosition().y * box2d.scale ); 
	context.rotate(this.bottom.GetAngle());
	var s2 = 0.5;
	var scale = s2;
	context.scale(scale,scale);
	context.drawImage(this.imgs.bottom,-35,-35);
	context.restore();
}

Worm.prototype.update = function () {
	
	if( this.head.beginContact != null ) {
		if( (this.head.beginContact.GetFixtureA().GetBody().name && this.head.beginContact.GetFixtureA().GetBody().name == 'player' ) ||
			(this.head.beginContact.GetFixtureB().GetBody().name && this.head.beginContact.GetFixtureB().GetBody().name == 'player' )) {
				console.log('contact -----------------');
				this.removeMe = true;
		}
	}
	if( this.head.endContact ) {
		this.head.beginContact = null;
		this.head.endContact = false;
		console.log('contact');
	}
	
}

Worm.prototype.remove = function () {
	console.log( box2d.world );
	box2d.world.DestroyBody( this.head );
	box2d.world.DestroyBody( this.middle );
	box2d.world.DestroyBody( this.bottom );
	//box2d.world.DestroyJoint( this.djoint2 )
	//box2d.world.DestroyJoint( this.rjoint2 );
}
