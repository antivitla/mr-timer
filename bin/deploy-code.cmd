ssh u49801@u49801.netangels.ru "rm -rf mr-woodman.ru/www/titamota/static/js && rm -rf mr-woodman.ru/www/titamota/static/css"
scp -r dist/static/js/ u49801@u49801.netangels.ru:~/mr-woodman.ru/www/titamota/static/js/
scp -r dist/static/css/ u49801@u49801.netangels.ru:~/mr-woodman.ru/www/titamota/static/css/
scp dist/index.html u49801@u49801.netangels.ru:~/mr-woodman.ru/www/titamota/
