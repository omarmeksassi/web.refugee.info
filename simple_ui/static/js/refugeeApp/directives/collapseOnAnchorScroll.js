angular.module('refugeeApp').directive('collapseOnAnchorScroll', function($document) {
    return {
        restrict: 'A',
        scope: {
            name: '@',
            target: '@',
            item: '='
        },
        link: function(scope) {
            $($document[0].body).on('click', 'a[href="#' + scope.name +'"]', function() {
                var $modal = $('#contentModal');
                if (scope.item.hide_from_toc) {
                    $modal.find('.modal-title').text(scope.item.title);
                    $modal.find('.modal-body').html(scope.item.section);
                    $modal.modal('show');
                } else {
                    $(scope.target).collapse('show');
                }
            });
        }
    };
});