
$.widget( "custom.carselect", $.ui.autocomplete, {
        _renderItem: function( ul, item ) {
			return $( "<li>" )
				.attr( "data-value", item.value )
				.append( "<div>" + item.label + "</div>" +
						 "<small>гос.№ <font color=#005800>" + item.n + "</font>, №1C: " +
						 "<font color=maroon>" + item.c + "</font>, " +
						 "<font color=teal>" + item.f + "</font></small>")
				.appendTo( ul );
        },
        _resizeMenu: function() {
            this.menu.element.outerWidth( 430 );
        }
    });




function KeyUpCar(ev) {
	if(ev.keyCode == 40	||
	   ev.keyCode == 38 ||
	   ev.keyCode == 13) {
		var keyEvent = $.Event("keydown");
		keyEvent.keyCode = ev.keyCode;
		// $('#car_id').trigger(keyEvent)
		return;
	}
	var v = $('#car').val();
	if(v.length < 1) {
		// $('#car_id').val('').carselect('close');
		var  availableTags = [];
		$( "#car").autocomplete({
      	source: availableTags
    	});
    	 $( "#car_id" ).val('');
		return;
	}
	 
	if(v.length > 2) {
		SearchCar(v);
	}
}

function KeyUpRfid(ev) {
    if(ev.keyCode == 40 ||
       ev.keyCode == 38 ||
       ev.keyCode == 13) {
        var keyEvent = $.Event("keydown");
        keyEvent.keyCode = ev.keyCode;
        // $('#car_id').trigger(keyEvent)

        return;
    }
    var v = $('#rfid').val();
    if(v.length < 1) {
        // $('#car_id').val('').carselect('close');
        var  availableRfid = [];
        $( "#rfid").autocomplete({
        source: availableRfid
        });
         // $( "#car_id" ).val('');
        return;
    }
     
    if(v.length > 1) {
        SearchRfid(v);
        console.log(v);
    }
}
function SearchRfid(v) {
    availableTags ='';
    $.post(dir + 'search-rfid.php', {firm_id:$('#firms').val(),rfid:v}).success(function (data) {
         //availableTags = JSON.parse(data);
         //var obj = jQuery.parseJSON( data );
         availableRfid = JSON.parse(data);
         // availableTags = [{id: "4793", value: "АЕ 80-83 В"}];

        $( "#rfid" ).autocomplete({
                  minLength: 0,
                  source: availableRfid,
                  focus: function( event, ui ) {
                    $( "#rfid" ).val( ui.item.value );

                    // $( "#car_id" ).val( ui.item.id );
                    RfidRefresh();
                    return false;
                  },
                  select: function( event, ui ) {
                    $( "#rfid" ).val( ui.item.value );
                     // $( "#car_id" ).val( ui.item.id );
                    RfidRefresh();
                    return false;
                  }
        });


         // console.log(data);
    });
    
    //console.log('---' + availableTags);
    //
    // var obj = '{"value":"1","label":"2","n":"3","c":"4","f":"5"}';
    //return obj;
    // console.log(rsp);

}
 
function SearchCar(v) {
    availableTags ='';
	$.post(dir + 'search-car.php', {firm_id:$('#firms').val(),car:v}).success(function (data) {
         //availableTags = JSON.parse(data);
         //var obj = jQuery.parseJSON( data );
         availableTags = JSON.parse(data);
         // availableTags = [{id: "4793", value: "АЕ 80-83 В"}];
 
        $( "#car" ).autocomplete({
                  minLength: 0,
                  source: availableTags,
                  focus: function( event, ui ) {
                    $( "#car" ).val( ui.item.value );
                    $( "#car_id" ).val( ui.item.id );
                    return false;
                  },
                  select: function( event, ui ) {
                    $( "#car" ).val( ui.item.value );
                    $( "#car_id" ).val( ui.item.id );
                    return false;
                  }
        });


         // console.log(data);
    });
    
    //console.log('---' + availableTags);
    //
	// var obj = '{"value":"1","label":"2","n":"3","c":"4","f":"5"}';
	//return obj;
	// console.log(rsp);

}

function Save(){
  if (!userRights.edit) return;
  $.post( dir+"001-rfid-card_save.php", { cd_number:$('#rfid').val(),car_id:$('#car_id').val(),firm_id:$('#firms').val(),cd_article:$('#cd_number').val(),cd_note:$('#note').val() })
    .done(function( data ) {
       rfidfltr();
    });
} 

function SelectCar(ev, ui) {
    $('#car').val(ui.item.label).attr('car_id', ui.item.i);
}


function rfidfltr(){
    var pd       = $("#list").jqGrid('getGridParam', 'postData');
    pd.cd_number = $('#rfid').val();
    $("#list").trigger('reloadGrid');
}


function List() {
    $Grid = $('#list').jqGrid({
        url         : dir + '001-rfid-card_history.php',
        datatype    : 'json',
        mtype       : 'POST',
        postData    :  {cd_number:0},
        width       : '100%',
        height      : '100%',
        colNames    : [ 'Предпирятие', 'Гос.номер', 'Наименование', 'Получил', 'Сдал'],
        colModel    : [
            {name:'firm',
                index:'firm',
                align:'left',
                width:250,
                stype: 'select',
            },
            {name:'cdo_beg',
                index:'cdo_beg',
                align:'left',
                width:100,
                edittype:'text',
            },
            {name:'cat',
                index:'cat',
                align:'left',
                width:400,
                stype: 'select',
            },
            {name:'param',
                index:'param',
                align:'center',
                width:120,
            },
        
            {name:'note',
                index:'note',
                align:'center',
                width:120,
            },
        ],
        pagination  : true,
        pager       : '#pager',
        page        : 1,
        rowNum      : 50,
        rowList     : [5,10,20,30,50,70,100,150],
        sortname    : 'firm',
        sortorder   : "asc",
        viewrecords : true,
        caption     : '',
        loadonce    : false,

        gridview: true,
        autoencode: true,
        height: "auto",
        rownumbers  : true,
        hidegrid    : false,
    });
    $Grid.jqGrid('navGrid','#pager', { edit:false, add:false, del:false, search:false });

}



// обработка карты
$("#rfid").on('change', function (e) {
 RfidRefresh();
});

function RfidRefresh(){
 $.post( dir+"001-rfid-card.php", { cd_number:$('#rfid').val() })
      .done(function( data ) {
        var obj = JSON.parse(data);
        if(Object.keys(obj).length != 0){
            $("#firms").val( obj.cd_firm );
           
            $("#car").val(obj.car);
            $("#car_id").val(obj.car_id);
            $("#cd_number").val(obj.cd_article);
            $("#note").val(obj.cd_note);
        }else{
            $("#firms").val( 0 );
            $("#car").val('');
            $("#car_id").val('');
            $("#cd_number").val('');
            $("#note").val('');
        }
         $("#firms").selectmenu("refresh");
         rfidfltr();
        
      });
}

$(document).ready(function() {
   	
    $( firm_select.split(";").map(function(x){var z=x.split(":"); return {id:parseInt(z[0]), value:z[1]};}) ).each(function()
     {
        //this refers to the current item being iterated over
         var option = $('<option />');
         option.attr('value', this.id).text(this.value);
         $('#firms').append(option);
     });
    $('#firms').selectmenu({ width:430,
        change: function( event, ui ) {
            $('#car').val('');
            $('#car_id').val('');
        }
    });

    $( cat_select.split(";").map(function(x){var z=x.split(":"); return {id:parseInt(z[0]), value:z[1]};}) ).each(function()
     {
        //this refers to the current item being iterated over
         var option = $('<option />');
         option.attr('value', this.id).text(this.value);
         $('#cat').append(option);
     });
    $('#cat').selectmenu({ width:430});

    $('#bsave').button({ width:120});
    $('#besc').button({ width:120});
    $('#report').button({ width:120});
    $('#rfidFltr').button();
    $('#own_0').prop('checked',true);

    tmp = $('#car' ).keyup(KeyUpCar);
    tmp.val(tmp.attr('b'));


    tmp2 = $('#rfid').keyup(KeyUpRfid);
     
   


     List();
});
