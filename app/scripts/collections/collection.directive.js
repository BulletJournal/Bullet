/*jshint esversion: 6*/

bulletApp.directive('collection', function($log){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collectionId: '@',
            props: '='
        },
        link: function(scope) {
            Collection.fetchById(scope.collectionId)
            .then(function(res){
                angular.extend(scope, res);
                scope.formattedTitle = formatTitle(scope.collection);
                scope.muted = false;
                scope.$evalAsync();
            })
            .catch(function(err) {
                scope.collection = new Collection(scope.props);
                scope.formattedTitle = formatTitle(scope.collection);
                scope.muted = true;
                scope.$evalAsync();
            });

            scope.newBullet = new Bullet.Task()

            function formatTitle(collection) {
                switch(collection.type) {
                    case 'month':
                        return Moment(collection.title).format('MMMM')+' Log';
                        break;
                    case 'future':
                        return Moment(collection.title).format('MMM YY').toUpperCase();
                        break;
                    case 'day':
                        return Moment(collection.title).format('MMM DD');
                        break;
                    default:
                        return collection.title;
                }   

            }

            
            /**********************************************************
            * This function will remove the bullet from the collection
            * and then make sure the bullet is also removed from the
            * local bullets array.
            **********************************************************/
            scope.removeBullet = function(bullet) {
                scope.collection.removeBullet(bullet)
                .then(function(){
                    scope.bullets = scope.bullets.filter(b => b.id !== bullet.id);
                })
                .catch($log.err);
            };
            scope.addBullet = function(bullet) {
                if (bullet.content.length > 0) {
                  scope.collection.addBullet(bullet)
                  .then(function(){
                      scope.bullets.push(bullet);
                      scope.newBullet = new Bullet.Task()
                      scope.$evalAsync()
                  })
                  .catch($log.err);
              };
            }
        }
    };
});
