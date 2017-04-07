$(function() {
  $(".sortable").sortable({
    revert: true,
    connectWith: "ul",
    receive: function( event, ui ) {
      let tableName = $(ui.item).children('div').attr('data-table');
      console.log(tableName);

      $(event.target)
        // find dragged-n-dropped item
        .find('div[data-table="'+tableName+'"]').attr('style','')
        // append remove icon
        .append('<span class="remove-item glyphicon glyphicon-remove" aria-hidden="true" title="Убрать"></span>')
        // attach click event
        .find('.remove-item').on('click',function () {
          $(this).parents('li').remove();
        });

      // this is the remove of the original item
      // $(ui.item).remove();
    }
  });
  $(".draggable").draggable({
    connectToSortable: "#tables.sortable",
    helper: "clone",
    revert: "invalid",
    scroll: true
  });
  $("ul, li").disableSelection();
});