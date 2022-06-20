<p align='center'>
     <img height="300" src="https://i.imgur.com/yhncbW8.gif" </img> 
     
</p>

# __Outfit Store APP - Tzuzul eCommerce__
## -Proyecto nro 2. -
<br>

## Datos del Presentación

- Fecha: `20 de junio del 2022`
- Integrantes: `Karen Urbano - Camilo Morales Sánchez - Willy Escobar`

## Objetivos del Proyecto

- Construir una Api utlizando Node, express y Mongo.
- Afirmar y conectar los conceptos aprendidos en el TzuzulCode bootcamp.
- Aplicar mejores prácticas y metodología de Ingeniería de Software.



# __Diagrama de Contexto__ 
<br>
<p align="center">
  <img  src="https://i.imgur.com/YI8qVdg.jpg" />
  
</p>

## Características de Arquitectura

- Rutas desacopladas 
- Parametrización de Tablas "Productos", "Categories" y "Subcategorías"


<br>


 
__IMPORTANTE:__ Es necesario contar minimamente con la última versión estable de Node y NPM. Asegurarse de contar con ella para poder instalar correctamente las dependecias necesarias para correr el proyecto.

Actualmente las versiónes necesarias son:

 * __Node__: 12.18.3 o mayor
 * __NPM__: 6.14.16 o mayor



En la carpeta `backend` crear un archivo llamado: `.env` que tenga la siguiente forma:<br>
Ejemplo:
```
# PORT

PORT=

# DATA-BASE

DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_NAME=


# private key JWT
PRIVATE_JWT=

# urls

CALLBACK_URL=
CALLBACK_URL_DEVELOPMENT=http://localhost:8081

# sesion secret

SESION_SECRET=

# passport autentication google

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


# passport facebook

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# passport twitter

TWITTER_APP_ID=
TWITTER_APP_SECRET=

# passport giThub

GITHUB_APP_ID=
GITHUB_APP_SECRET=

# passport instagram 

INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=



#email settings

EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_USER=
EMAIL_PASSWORD=

# stripe key

STRIPE_PK=
STRIPE_SK=
ENDPOINT_SECRET=

```

Reemplazar `Las variables de entorno` con las propias credenciales.
Para más información diríjase al archivo `.env.ejemplo`


# __Especificaciones Generales__


<br>
<p align="center">
  <img  src="https://i.imgur.com/TEqckMI.jpg" />
</p>

__IMPORTANTE__: Se controlará acceso a través de un token de REGISTRO DE SESIÓN la autorización a las siguientes funcionalidades de acuerdo los privilegios del ROL de cada LOGIN.
Contempla registro a través de redes sociales y validación de mail de singUp por medio de comprobación en dicha casilla de correo.

<!-- # Operaciones para el rol EMPLOYER
 
  - GENERAR ofertas laborales completando los siguientes datos:
    - Name: título de la oferta
    - Country: país donde se ofrece la posición.
    - Category: categoría a la que pertenece la oferta.
    - Detalles: Requerimientos solicitados mandatorias y/o deseables a saber:
      - Salary: Salario ofrecido.
      - Modality: Si se trata de modo presencial, remoto o híbrido.
      - Seniority: Antiguedad y experiencia requerida
      - Description: Explicación de la tarea a realizar.
  - Podrá CONSULTAR ofertas y filtrarlas según:
    - Country
    - Category
  - Puede BORRAR ofertas laborales creadas por si mismo.
  - Puede MODIFICAR ofertas laborales creadas por si mismo.

# Gestión para el rol USER
- Podrá consultar ofertas laborales y filtrarlas según:
    - Country
    - Category
 - Podrá APLICAR a ofertas laborales
 - Podrá DESAPLICAR a ofertas laborales
 <br>
 __ADVERTENCIA__: Al desaplicar a las ofertas laborales USER perderá dicha afectación, se recomienta que front end se cerciore antes de realizar el pedido a la ruta dado que no se guarda en un status de "eliminado" y no se podrá recuperar salvo que se vuelva a ejecutar todo el procedimiento de hallazgo de dicha oferta nuevamente.
 

# Funcionalidades del rol ADMINISTRATOR
 
  - ADMIN puede crear, borrar, modificar y consultar USUARIOS.
  - ADMIN puede crear, borrar, modificar y consultar PARAMETROS  (las tablas COUNTRY y CATEGORY) -->

__IMPORTANTE__: No se desarrolla un borrado definitivo de los usuarios, se aplica una eliminación lógica a través de un campo status que podrá reestablecerse a true mediante de un UPDATE del mismo.


#### Tecnologías necesarias:

- [ ] Express
- [ ] Mongo 
- [ ] Node 


## __Base de datos:__

El modelo de la base de datos se implementa en MONGODB con las siguientes tablas y referencias:
<br><br>

# __Diagrama Entidad Relación__  
<br>
<p align="center">
  <img  src="https://i.imgur.com/NmB9AKG.jpg" />
</p>


<br>

# __API REST__



Servidor en Node/Express con las siguientes rutas:

__URL BASE__: http://localhost:PORT/api/v1
<br>
<br>

<br>
<p align="left">
  <img  height="100"
  " src="https://i.imgur.com/n2tmiwE.png" />
</p>



# __DOCUMENTACION SWAGGER__

http://localhost:8081/api-docs/#/
