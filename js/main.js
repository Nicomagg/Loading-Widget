initialize_slider = function() {
	x=1
	backwait=0
	$('#next-button').click(function() {
		manualSlide('right')
	})
	$('#prev-button').click(function() {
		manualSlide('left')
	})
	autoslide()
};
manualSlide = function(s) {
	window.clearTimeout(timer)
	if (s=='right') {
		if (x==(num_items-1)) {
			slideTo(1)
		}else{
			slideTo(x+1)
		}
	}else{
		if (x==1) {
			slideTo(num_items-1)
		}else{
			slideTo(x-1)
		}
	}
	backwait=1
	aSlide()
};
aSlide = function() {
	if (!backwait) {
		if (x==num_items-1) {
			slideTo(1)
		}else{
			slideTo(x+1)
		}
		timer=window.setTimeout(aSlide,time*1000)
	}else{
		timer=window.setTimeout(aSlide,time*1000*(backwait+1))
		backwait--
	}
}
autoslide = function() {
	timer=window.setTimeout(aSlide,time*1000)
};
slideTo = function(p) {
	option=(window.innerWidth*(p-1))
	$('#slider-s').animate({'right':option+'px'},'slow')
	x=p
};
error_callback = function(tx,error){};
success_callback = function(tx){};

var image=[]
var timer
var db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
$(document).ready(function() {
	num_items=$('.feature').length+1
	$('#load').css('height',window.innerHeight+'px')
	$('#ready').click(function(event) {
		event.preventDefault()
		if (image.length>0) {
			time=$('#tiempo').val()
			if (!$.isNumeric(time)) {
				$('#tiempo').css({'border':'1px solid red'})
				return
			}
			$('#load').hide('slow')
			$.each(image,function(i,elem){
				$('#slider-s').append('<div class="feature" id=feature'+(image.length-i)+'></div>')
				$('#feature'+(image.length-i)).append('<img src='+elem.src+' width='+window.innerWidth+' height='+window.innerHeight+'>')
			})
			num_items=$('.feature').length+1
			$('#slider-s').css('width',num_items*window.innerWidth)
			$('#splash').css('height',window.innerHeight)
			$('#container').css('height','0px')
			$('#main').show('slow')
			initialize_slider()
		}else{
			alert('No hay imagenes cargadas.')
		}
	})
	$('#back-button').click(function() {
		$('#main').hide('slow')
		window.clearTimeout(timer)
		$('#slider-s').css('right','0px')
		$('#slider-s').empty()
		$('#prev-button').unbind('click')
		$('#next-button').unbind('click')
		$('#container').css('height',window.innerHeight+'px')
		$('#load').show('slow')
	})
	$(window).resize(function() {
		$('#container').css('height',window.innerHeight+'px')
		$('#load').css('height',window.innerHeight+'px')
		$('#slider-s').css('width',num_items*window.innerWidth)
		$('#splash').css('height',window.innerHeight)
		$.each(image,function(i,elem){
			a=$('#feature'+(image.length-i))
			a.css({'width':window.innerWidth,'height':window.innerHeight})
			b=a.children()
			b.css({'width':window.innerWidth,'height':window.innerHeight})
		})
	})
	window.ondragover = function(e) { e.preventDefault(); return false };
	window.ondrop = function(e) { e.preventDefault(); return false };
	window.ondrop = function (event) {
		event.preventDefault();
		var files=event.dataTransfer.files
		$.each(files,function(i,elem) {
			var foto=new Image()
			var path=files[i].path
			foto.src=path
			var sql="INSERT INTO images (path) values (?)"
			image.push(foto)
			db.transaction(function(tx){
  				tx.executeSql('CREATE TABLE IF NOT EXISTS images (path unique)');
  				tx.executeSql(sql,[path],success_callback,error_callback);
			})
		})
		return false;
	};
	$('#close-button').click(function(e) {
		e.preventDefault()
		window.close()
	})
	var gui = require('nw.gui');
  	var win = gui.Window.get();
	win.on('close', function() {
    	localStorage.x=win.x;
    	localStorage.y=win.y;
    	localStorage.width=win.width;
    	localStorage.height=win.height;
    	this.close(true);
  	});
	if (localStorage.width && localStorage.height) {
		win.resizeTo(parseInt(localStorage.width), parseInt(localStorage.height));
		win.moveTo(parseInt(localStorage.x), parseInt(localStorage.y));
		db.transaction(function (tx) {
  			tx.executeSql('SELECT * FROM images', [], function (tx, results) {
    			var len = results.rows.length, i;
    			for (i = 0; i < len; i++) {
    				var foto=new Image()
					var path=results.rows.item(i).path
					foto.src=path
					image.push(foto)
    			}
  			});
		});
    }
    win.show();
	$('#ready').click()
});
//db.transaction(function(tx){tx.executeSql('DROP TABLE images');}) Y LA PUTA MADRE ALL BOYS