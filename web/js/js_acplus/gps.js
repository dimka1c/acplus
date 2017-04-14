var $DlgUpload	= null,
	$DlgUpLdr	= null;

function AmtCars(){
  var url = '<?php print $fl?>/scripts/amtcars.php';
  $.post(url,
    {  },
    function(data){
      $('#amtcars').html(data);
    },
    "html"
  );
}

function tickTime(a) {
	if(!a) return;
	$('#srv_time').text(a);
	var t = a.split(':');
	t[2]++;
	if(t[2] < 10) t[2] = '0' + t[2];
	if(t[2] > 59) {
		t[2] = '00';
		t[1]++;
		if(t[1] < 10) t[1] = '0' + t[1];
	}
	if(t[1] > 59) {
		t[1] = '00';
		t[0]++;
		if(t[0] < 10) t[0] = '0' + t[0];
	}
	if(t[0] > 23) {
		t[0] = '00';
	}
	setTimeout('tickTime("' + t.join(':') + '")', 1000);
}

function Numerals(i, s, s1, s2, s5, p1, p2, p5) {
	if (typeof(p1) == 'undefined') p1 = '';
	if (typeof(p2) == 'undefined') p2 = '';
	if (typeof(p5) == 'undefined') p5 = '';
	if (i == 0) return p5 + ' ' + i + ' ' + s + s5;
	var s0 = s5,
		p0 = p5,
		id = i % 100;
	if (id < 5 || id > 20)
	{
		switch (i % 10)
		{
			case 1:
				s0 = s1;
				p0 = p1;
				break;
			case 2:
			case 3:
			case 4:
				s0 = s2;
				p0 = p2;
				break;
		}
	}
	return p0 + ' ' + i + ' ' + s + s0;
}

function FileSizeText(sz) {
	if(sz < 1024) return sz + ' �.';
	if(sz < 1048576) return (sz/1024).toFixed(2) + ' ��.';
	if(sz < 1073741824) return (sz/1048576).toFixed(2) + ' ��.';
	return (sz/1073741824).toFixed(2) + ' ��.';
}

function UploadStart(id, t) {
  if (!userRights.edit) return; // have no idea will it work or not
	UploadCancel();
	$DlgUpload.attr('t', t);
	$DlgUpload.attr('i', id);
	$('#btnUpload').hide();
	$DlgUpload.dialog('open');
	$('#AttFileCtrl').click();
}

function UploadImages() {
  if (!userRights.edit) return; // have no idea will it work or not
	var fl = $('#AttFileCtrl').prop('files');
	var uType = Math.floor($DlgUpload.attr('t'));
	var uId = $DlgUpload.attr('i');
	if(fl.length == 0 || uType == 0 || uId == '') {
		$DlgUpload.dialog('close');
		return;
	}
	var fd = new FormData();
	var bSizeBad = false;
	$.each(fl, function(k,v){
		if(v.size > 3000000) {
			bSizeBad = true;
		} else {
			fd.append("files[]", v);
		}
	});
	if(fl.length == 0) {
		jConfirm('��������� ��������� ��������� ���� 2,85��!\n������� ���� ��������?', '�������', function(bAnsw){
			if(bAnsw) $DlgUpload.dialog('close');
		});
		return;
	}
	$('#btnUpload').hide();
	$DlgUpLdr.show();
    fd.append("i", uId);
    fd.append("t", uType); //1-img, 2-money.csv, 3-state.csv
	$.ajax({
		url: dir + '/fileupload_sim.php',
		type: "POST",
		data: fd,
		dataType: 'json',
		processData: false,
		contentType: false,
		success: function (res) {
			$DlgUpLdr.hide();
			if(res.status != 'OK') {
				jError("������� ��� �����������:\n" + res.status);
			} else {
				if(uType == 1) { // IMG
					// Reload row
				} else {
					var msg = '���������' + Numerals(res.info.tot, '�����', '�', '�', '', '�', '�', '�') + '\n' +
							  '��������' + Numerals(res.info.upd, '�����', '', '�', '��', '', '�', '�');
					if(res.info.add > 0) msg += '\n��������' + Numerals(res.info.add, '�����', '', '�', '��', '', '�', '�');
					msg += '\n����� ���������: ' + res.time + '�.';
					jAlert(msg);
					$Grid.trigger('reloadGrid');
				}
			}
			$DlgUpload.dialog('close');
			return;
		},
		error: function() {
			$DlgUpLdr.hide();
            jAlert('��� ����������� ����� ������� �������. ��������� �����');
			return;
		}
	});	
}

function UploadCancel() {
	$DlgUpload.attr('t', '');
	$DlgUpload.attr('i', '');
	$('#AttFileCtrl').val('');
	$('#AttSelFile').show();
	$('#AttDelFile').hide();
	$('#AttFiles').html('');
	$DlgUpLdr.hide();
}

$(document).ready(function() {
	$.post('gps_time.php', {}, tickTime, 'html');
	$(document).attr('title', 'GPS ����������');
	
	// ��������� �������� ������
	// ������� ������ ������
	$('#AttFileCtrl')
		.on('change', function(evt){
	        var $Files = $(evt.target).prop('files');
	        var len = $Files.length;
	        if(len == 0) {
        		$('#AttSelFile').show();
        		$('#AttDelFile').hide();
        		return;
			}
			var div = $('#AttFiles').html('');
			var bSizeOk = true;
			$.each($Files, function(k,v){
				var c_box = 'ui-state-highlight',
					c_img = 'ui-icon-document';
					tit = '',
					msg = '';
				
				if(v.type.startsWith('image/')) c_img = 'ui-icon-image';
				if(v.size > 3000000) {
					c_img = 'ui-icon-alert';
					c_box = 'ui-state-error';
					tit = 'title="������ ����� ��������� 2,86 ��."';
					msg = '&nbsp;<b>������ ����� ��������� 2,86 ��.</b>';
					bSizeOk = false;
				}
				div.append(
					'<div class="ui-corner-all ' + c_box + '" style="padding:0.3em;"' + tit + '>'
						+ '<span class="ui-icon ' + c_img + '" style="display:inline-block; vertical-align: middle;"></span>'
						+ '<span class="ui-file"><b>' + v.name + '</b>&nbsp;<small>(' + FileSizeText(v.size) + ')</small>' + msg + '</span>'
					+ '</div>');
			});
	        $('#AttSelFile').hide();
	        $('#AttDelFile').show();
	        if(bSizeOk) {
	        	$('#btnUpload').show();
	        	$('#btnUpload').focus();
			} else {
	        	$('#btnUpload').hide();
	        	$('#AttDelFile').focus();
			}
    	});
    // ������ ����� ������ 		
	$('#AttSelFile')
		.button({icons: {primary: 'ui-icon-folder-open'}})
		.click(function() { $('#AttFileCtrl').click(); });
	// ������ ������� ������ ������
	$('#AttDelFile')
		.button({icons: {primary: 'ui-icon-trash'}})
		.click(function() {
			$('#AttFileCtrl').val('');
			$('#AttSelFile').show();
	        $('#AttDelFile').hide();
	        $('#AttFiles').html('');
	        $('#btnUpload').hide();
	        $('#AttSelFile').focus();
		});
	
	// ������ �������� ������
	$DlgUpload = $('#dlg_upload').dialog({
		autoOpen: false,
		show: 800,
		hide: 800,
		modal: true,
		title: '������ ����',
		width: 400,
		height: 300,
		buttons: [
			{text: '������', icons: {primary: 'ui-icon-disk'}, id: 'btnUpload', click: UploadImages },
			{text: '³������', icons: {primary: 'ui-icon-cancel'}, click: function(){ $DlgUpload.dialog('close');} }
		],
		close: UploadCancel
	});	
	$DlgUpload.parent().find('.ui-dialog-buttonset').before('<div id="dlg_upload_loader" style="float:left;margin-top:8px;"><img src="./images/loading.gif"></div>');
	$DlgUpLdr = $('#dlg_upload_loader');
	
});