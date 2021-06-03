$( document ).ready(function() {
	$('.slds-dropdown-trigger_click').click(function(event){
	    // $(this).addClass('slds-is-open');
	    $(this).toggleClass('slds-is-open');
	});	
	// $( ".slds-dropdown-trigger_click" ).on( "click", "li", function() {
	// 	console.log( $( this ).find('.slds-truncate').attr('title'));
	//  //  console.log( $( this ));
	//  //  var parent = $( this ).parents('.slds-combobox');
	//  //  parent.removeClass('slds-is-open');
	//  //  var element = $( this ).find('.slds-truncate');
	//   $( this ).find('input').val($( this ).find('.slds-truncate').attr('title'));
	// });
});