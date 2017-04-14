        $(function() {
            // create the image rotator
           setInterval("rotateImages()", 5000);
        });

        function rotateImages() {
            var oCurPhoto = $('#screenSmartphone div.currentSmart');
            var oNxtPhoto = oCurPhoto.next();
            if (oNxtPhoto.length == 0)
                oNxtPhoto = $('#screenSmartphone div:first');

            oCurPhoto.removeClass('currentSmart').addClass('previousSmart');
            oNxtPhoto.css({ opacity: 0.0 }).addClass('currentSmart').animate({ opacity: 1.0 }, 1000,
                function() {
                    oCurPhoto.removeClass('previousSmart');
                }); 
        }
        