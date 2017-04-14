// $("#maindiv").height($(".content").height());
// $(".content").css("padding-bottom","45px");
$(".page_wrapper").css({"width":"92%"});
$(".page_wrapper").css({"margin":"auto"});
$(".page_wrapper").css({"max-width":"1440px"});

var tmp1 =  '<div class="header">'+$(".header").html()+'</div><div id="rep_content"></div>'+
            '<link rel="stylesheet" href="../codebase/skins/compact.css" type="text/css" media="screen" charset="utf-8">'+
            '<script src="../codebase/webix.js" type="text/javascript" charset="utf-8"></script>'+
            '<script src="/page/report_scr/rep_1.js" type="text/javascript" charset="utf-8"></script>'+
            '<script src="/page/report_scr/rep_2.js" type="text/javascript" charset="utf-8"></script>';

$( ".footer" ).remove();
$( ".container" ).remove();
$( ".page_wrapper" ).append(tmp1);

$( "#rep_content" ).height( $(window).height() - 150 );
/*$(".page_wrapper").css({"width":"96%"});
$(".header").css({"width":"96%"});
$("#rep_content").css({"width":"96%"});*/


$.post( "page/report_scr/rep_list.php", {id:UserId})
  .done(function(data){

  var cells = JSON.parse(data);

  webix.ready(function(){

    webix.i18n.timeFormat = "%H:%i";
    webix.i18n.setLocale("ru-RU");
    // webix.i18n.setLocale();

    webix.ui(
    { container:"rep_content",
      rows:
      [
        {height:5},
        {
          type:"space",
          rows:[{    
            view:"tabview",
            id:"tabview",
            tabbar:{ optionWidth:170},
            animate:true,
            cells:cells
            }]
        },
        {height:5},
      ]
    }
    );

    cells.forEach(function(dat){
      var name_rep = dat.report;
      var ex  = eval(name_rep);
      rep_ex = new ex("tab_1_"+webix.uid(),dat.id,name_rep+'z');
      rep_ex.init();
      $$(dat.id).removeView(dat.mytemplate);
      rep_ex = '';
    });  

  });
});  

function login(){
      var values = $$('log_form').getValues() ;

      $$("containermain").removeView("containerlog");

      return;
      //webix.ajax().post("login.php", { psw:values['psw'], login:values['login']}); 

      webix.ajax().post("login.php", { login :values['login'],psw:(values['psw']) }, function(text, xml, xhr){
      //response
        console.log(text);
        if(text=='ok'){
          window.location = "index.php";
        }
      });
      $$('login1').focus();
 }

function r0001_fuel_report(){


var gridA =
  {rows:[
    {
          cols:[  {},
              {view:"template",type:"clean",template:'<h2 style="margin:4px;color:#ac0056;">Отчет по расходу топлива</h2>',width:270},
              {view:"datepicker", label:"&nbsp;&nbsp;начало",minDate:'2016-06-01',value:new Date(), width:180, labelWidth:60, id:"dt1"},
              {view:"datepicker", label:"&nbsp;&nbsp;конец", value:new Date(), width:180, labelWidth:60, id:"dt2"},
              {view:"button",width:120,label:"Показать",
                on:{
                onItemClick:function(){
                $$('cgrid').clearAll();
                $$('cgrid'). showOverlay ( "Loading..." ) ;
                webix.ajax().post("page/scripts/001-my-report.php",{dt1:$$('dt1').getValue(),dt2:$$('dt2').getValue()},{
                error:function(){},success:function(text,data){
                  var realdata = data.json();
                  $$('cgrid').parse(realdata);
                   $$('cgrid') . hideOverlay ( ) ;
                  }});
                }
              }
            },
            {view:"button",width:150,label:"Экспорт в Excel",
              on:{
                onItemClick:function(){
                  webix.toExcel($$('cgrid'));
                }
              }
            },
            {}
            ]
    },
    {height:10,},
    {
        view:"datatable",
                  select:true,
                    //editaction: "dblclick",
                    id:"cgrid",
                    navigation:true,
                    resizeColumn:true,
                    //resizeRow:true,
                    url:"page/scripts/001-my-report.php",
                    height: $("#maindiv").height(),
                    //footer:true,
        columns:[

          { id:"dt1", header:[{text:"Смена",    height:20 ,colspan:2,},"Начало"],  width:90,         css:"cell_center" },
          { id:"dt2",   header:['',{ text:"Конец",height:40 ,padding: 0, margin: 0,}], width:90,     css:"cell_center" },
          { id:"nomer_ts",  header:[{text:"Гос №",                   height:20 ,padding: 0, margin: 0},  {content:"textFilter"}],  width:90  },
          { id:"typets",   header:[{ text:"Тип ТС",         height:20 ,padding: 0, margin: 0,css:"cell_center" },  {content:"textFilter"}], width:100 },
          // { id:"firm",      header:{ text:"Предприятие",             height:20 ,padding: 0, margin: 0,css:"cell_center" }, width:180 },
          { id:"name_ts",   header:[{ text:"Наименование ТС",         height:20 ,padding: 0, margin: 0,css:"cell_center" },  {content:"textFilter"}], width:150 },
          { id:"zapr",      header:{text:"Заправка за период (л)",   height:20 ,padding: 0, margin: 0,css:"multiline", rowspan:2}, width:80, css:"cell_center" },
          { id:"probeg",    header:{text:"Пробег за период (км)",    height:20 ,padding: 0, margin: 0,css:"multiline", rowspan:2}, width:80, css:"cell_center"},
          { id:"rashod_lkm", header:{text:"Расход (л/км)",     height:20 ,padding: 0, margin: 0,css:"multiline", rowspan:2}, width:75, css:"cell_center"},

          { id:"u_begin",   header:[{text:"Уровень топлива ДУТ(л)",  height:20 ,colspan:2,},"На начало"], width:85,        css:"cell_center" },
          { id:"u_end",     header:['',{ text:"На конец",            height:30 ,padding: 0, margin: 0,}], width:85,        css:"cell_center" },

          { id:"sliv",       header:{text:"Сливы за период (л)",      height:20 ,padding: 0, margin: 0,css:"multiline", rowspan:2}, width:80, css:"cell_center"},
          { id:"rashod",    header:{text:"Расход за период (л)",     height:20 ,padding: 0, margin: 0,css:"multiline", rowspan:2}, width:80, css:"cell_center"},

         /* { id:"fost",    header:[ {text:"Ручные данные из путевого (л)", height:20 ,colspan:3},"Остаток на начало"     ],  width:80,     css:"textright" },
          { id:"fzapr",   header:['',{ text:"Заправка за период",     height:50 ,padding: 0, margin: 0,css:"cell_center"}], width:80,     css:"textright" },
          { id:"frashod",   header:['',{ text:"Расход за период",     height:50 ,padding: 0, margin: 0,css:"cell_center"}], width:80,     css:"textright" },*/




        ],
        on:{
          onItemDblClick:function(){
                form_update();
              },
              onKeyPress:function(ecode){
                if(ecode==13){
                  form_update();
                }
              },
              onBeforeLoad : function ( ) {
                  this . showOverlay ( "Loading..." ) ;
              } ,
              onAfterLoad : function ( ) {
                  this . hideOverlay ( ) ;
              },
        }

      },
  ]};



$$("containermain").addView( gridA);



}

function form_update(){ 
 var record = $$("cgrid").getItem($$("cgrid").getSelectedId());

  var form = {
    container:"data_container",
    view:"form", scroll:false,id:"form",
    
      rows:[
        {cols:[{},
        {rows:[
        {view:"text",label:"Заправка (л)", id:"zapr",  labelWidth:100,width:200, attributes:{ type:"number" }, value:"0",
        on:{

          onItemClick:function(){
            var item =this.getInputNode();
            item.select();
          },
           onfocus:function(){
            var item =this.getInputNode();
            item.select();
          },
          onKeyPress:function(ecode){
            if(ecode==13){
              var item = webix.UIManager.getNext(this);
                item.focus();
            }
          },

        }
      },
      {view:"text",label:"Слив (л)", id:"sliv",  labelWidth:100,width:200, attributes:{ type:"number" },value:"0",
        on:{

          onItemClick:function(){
            var item =this.getInputNode();
            item.select();
          },
           onfocus:function(){
            var item =this.getInputNode();
            item.select();
          },
          onKeyPress:function(ecode){
            if(ecode==13){
              
                $$("bsave").focus();
            }
          },

        }
      }]},{}]},
        {height:5},
        { cols:[ 
          {view:"button",label:"Сохранить" ,id:"bsave",type:"form", width:150,click:"form_save( $$('zapr').getValue(),$$('sliv').getValue() );"},
          {view:"button",label:"Отмена"    ,type:"form", width:150,click:"$$('win4').close();"},
         ]
        },
      

      ] ,
  };

  var window = webix.ui({
      view:"window",
      id:"win4",
      height:480, width:500,
        position:"center",
        modal:true,
        move:true,
        head:{
        view:"toolbar", margin:-4, cols:[
          {view:"label",id:"win4label",label: "<span style='font-size:13px;'>Оформление заправки</span>" },
          { view:"icon", icon:"times-circle", css:"alter",click:"$$('win4').close();"}
          ]
      },
      body:webix.copy(form)
    }).show();
    
    
    $$('zapr').setValue(record.zapr);
    $$('sliv').setValue(record.sliv);

    $$('zapr').focus();
}

function form_save(zapr,sliv){
  var record = $$("cgrid").getItem($$("cgrid").getSelectedId());
  var rashod = parseInt(record.u_begin) + parseInt(zapr) + parseInt(sliv) - parseInt(record.u_end);

  $.post("page/scripts/001-my-report_save.php",{id:record.id,zapr:zapr,sliv:sliv,rashod:rashod}).done(function(data){
    
    console.log(data);
    var ret = JSON.parse(data);
    
   
     

  }); 

  record.rashod = rashod;
  record.zapr   = zapr;
  record.sliv   = sliv;
   $$("cgrid").refresh();
  $$('win4').close();
}