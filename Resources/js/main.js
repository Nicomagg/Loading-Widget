initialize_slider = function() {
	x=1
	backwait=0
	temporizador=0
	$('#next-button').click(function() {
		manualSlide('right')
	})
	$('#prev-button').click(function() {
		manualSlide('left')
	})
	autoslide()
};
manualSlide = function(s) {
	clearTimeout(temporizador)
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
		temporizador=setTimeout(aSlide,7000)
	}else{
		temporizador=setTimeout(aSlide,7000*(backwait+1))
		backwait--
	}
}
autoslide = function() {
	temporizador=setTimeout(aSlide,7000)
};
slideTo = function(p) {
	option=(window.innerWidth*(p-1))
	$('#slider-s').animate({'right':option+'px'},'slow')
	x=p
};
image=[]
links=['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg','img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpg','img/10.jpg']
$.each(links,function(i,elem) {
	foto = new Image()
	foto.src=elem
	image.push(foto)
})
$(document).ready(function() {
	num_items=$('.feature').length+1
	$('#container').css('height',window.innerHeight+'px')
	$('#load').css('height',window.innerHeight+'px')
	$('#ready').click(function(event) {
		event.preventDefault()
		if (image.length>=4) {
			$('#load').hide('slow')
			$.each(image,function(i,elem){
				$('#slider-s').append('<div class="feature" id=feature'+(image.length-i)+'></div>')
				$('#feature'+(image.length-i)).css({
					'background':'url("'+elem.src+'") no-repeat center center fixed',
					'width':window.innerWidth,
					'height':window.innerHeight
				})
			})
			num_items=$('.feature').length+1
			$('#slider-s').css('width',num_items*window.innerWidth)
			$('#splash').css('height',window.innerHeight)
			$('#main').show('slow')
			$('#container').css('height','0px')
			initialize_slider()
		};
	})
	$(window).resize(function() {
		$('#container').css('height',window.innerHeight+'px')
		$('#load').css('height',window.innerHeight+'px')
		$('#slider-s').css('width',num_items*window.innerWidth)
		$('#splash').css('height',window.innerHeight)
		$.each(image,function(i,elem){
			$('#feature'+(image.length-i)).css({
				'background':'url("'+elem.src+'") no-repeat center center fixed',
				'width':window.innerWidth,
				'height':window.innerHeight
			})
		})
	})
	$('#cargar').click(function(){
		dirImg=$('#image input')[0].value
		console.log(dirImg)
		if (dirImg!='') {
			dir=dirImg.split('\\').pop()
			foto=new Image()
			foto.src='img\\'+dir
			foto.onload= function() {
				image.push(foto)
				$('#image input')[0].value=''
			}
			foto.onerror= function() {
				alert('Error, imagen invalida')
				$('#image input')[0].value=''
			}

		};
	})
});

