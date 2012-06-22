// on DOM loaded
$(function(){
	$('.newgame button').click(function(){
		$('#game .hide').show();
		$(this).fadeIn().text('Restart game').show();
		W.start();
	});
	
});