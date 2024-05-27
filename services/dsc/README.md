Ces dossiers contiennent les configurations pour les DSC du provider et du consumer. 
  - les configurations du consumer doivent être revues, les fichiers supprimés en correspondance avec ceux du provider
  - la configuration de la DB mongo doit être mise à jour pour aller vers une base spécifique 

Pour la publication plus automatisée, un nouveau container basé sur la version du DSC doit être mis en place. Dans ce container, les fichiers de configuration de chaque connecteur sont copiés dans le container au bon path. 
