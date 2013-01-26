
function Player( o ) {
	if ( !o ) {
		o = {};
		o.x = 5;
		o.y = 10;
		o.r = 0.5;
		o.a = 2 * Math.PI;
	}
	// TODO: Angle
	this.body = box2d.create.circle({r: o.r, x: o.x, y: o.y, static: false }),
	this.body.name = 'player';
	
	this.levels = {
		jump: 1,
		attack: 1,
		speed: 1,
		health: 10,
		recovery: 1000 // milliseconds
	};
	
	this.states = { normal: 'normal', attack: 'attack', disabled: 'disabled' };
	this.state = this.states.normal;

	this.imgs = {
		"normal1": $('#cell1').get(0),
		"normal2": $('#cell2').get(0),
		"normal3": $('#cell3').get(0),
		"attack": $('#cellspikes').get(0),
		"disabled": $('#celldisabled').get(0)
	}
	
	this.attackHandler = this.attackHandler.bind( this ); 
	this.postAttackHandler = this.postAttackHandler.bind( this ); 
	this.recoverFromDamage = this.recoverFromDamage.bind( this ); 
	this.postRecoverFromDamage = this.postRecoverFromDamage.bind( this  );

}

Player.prototype.imgs = {};

Player.prototype.draw = function ( context ) {
	context.save();
	context.translate( this.body.GetPosition().x * box2d.scale, this.body.GetPosition().y * box2d.scale ); 
	context.rotate( this.body.GetAngle() );
	var s2 = 0.5;
	var scale = s2;
	context.scale( scale, scale );
	var img;
	if (this.state == "normal") {
		var index = Math.floor((game.gameTime/2) % 3) + 1;
		img = this.imgs[this.state + index];
	}
	else
		img = this.imgs[this.state];
	context.drawImage( img, -img.width/2, -img.height/2 );
	context.restore();
}

Player.prototype.update = function () {
	if ( score.wormsKilled > 2 ) {
		// attack level up
	} else if ( score.wormsKilled > 7 ) {
		// attack level up
	} else if ( score.wormsKilled > 15 ) {
		// attack level up
	}
	
	if ( score.boilsKilled > 2 ) {
		// jump level up
	} else if ( score.boilsKilled > 7 ) {
		// jump level up
	} else if ( score.boilsKilled > 15 ) {
		// jump level up
	}
	
}

Player.prototype.attackReady = true;
Player.prototype.attack = function () {
	if( this.attackReady ) {
		this.state = this.states.attack;
		this.attackReady = false;
		setTimeout( this.attackHandler, 1000 );
	}
}

Player.prototype.attackHandler = function () {
	this.state = this.states.disabled;
	
	setTimeout( this.postAttackHandler, this.levels.recovery );
}

Player.prototype.postAttackHandler = function () {
	this.attackReady = true;
	this.state = this.states.normal;
}

Player.prototype.update = function (deltaTime) {
	if( this.body.beginContact != null ) {
		var name1 = this.body.beginContact.GetFixtureA().GetBody().name;
		var name2 = this.body.beginContact.GetFixtureB().GetBody().name;
		if ((name1 && name1 == "ground" || name2 && name2 == "ground") && this.body.m_linearVelocity.Length() > 3) {
			//game.particleEngine.addParticle({x:});
			var manifold = new b2WorldManifold();
			this.body.beginContact.GetWorldManifold(manifold);
			var collisionPoint = manifold.m_points[0];
			collisionPoint.Multiply(box2d.scale);

			game.particleEngine.addParticle({x: collisionPoint.x, y: collisionPoint.y, color:"ground"});
		}
		if( this.state != this.states.attack ) {
			if( (this.body.beginContact.GetFixtureA().GetBody().name && this.body.beginContact.GetFixtureA().GetBody().name == 'worm' ) ||
				(this.body.beginContact.GetFixtureB().GetBody().name && this.body.beginContact.GetFixtureB().GetBody().name == 'worm' )) {
					if ( !this.recoveryMode ) {
						this.recoveryMode = true;
						this.bodyImage = $(document.body).css( 'background-image' );
						$(document.body).css( {'background-image': 'url("img/bg_sick_tile.png")' });
						this.levels.health--;
						setTimeout( this.recoverFromDamage, 100 );
					}
			}
		}
	}
	if( this.body.endContact ) {
		this.body.beginContact = null;
		this.body.endContact = false;
	}

	if (Math.random() < deltaTime) {
		var pos = this.body.GetWorldCenter();
		game.particleEngine.addParticle({x:pos.x*box2d.scale, y:pos.y*box2d.scale, color:"bubble"});
	}
}
Player.prototype.recoveryMode = false;
Player.prototype.recoverFromDamage = function () {
	if( !this.recoveryMode ) {
		return;
	}
	$(document.body).css( {'background-image': this.bodyImage });
	
	setTimeout( this.postRecoverFromDamage, 300 );
}
Player.prototype.postRecoverFromDamage = function () {
	this.recoveryMode = false;
}

Player.prototype.getState = function () {
	return this.state;
}
Player.prototype.isAttacking = function () {
	return this.state == this.states.attack;
}
