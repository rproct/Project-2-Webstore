drop table if exists shopping_cart;
drop table if exists user;
drop table if exists product;
drop table if exists product_details;

create table user (
  user_id      integer primary key AUTO_INCREMENT,
  first_name   varchar(20),
  last_name    varchar(20),
  address      varchar (100),
  username     varchar(30) unique,
  password     varchar(60),
  is_admin     boolean
);

create table product_details (
  product_details_id   integer primary key AUTO_INCREMENT,
  color                varchar(20),
  price                numeric(6, 2),
  sq_ft                integer,
  long_description     varchar(500)
);

  create table product (
    product_id           integer primary key AUTO_INCREMENT,
    name                 varchar(30),
    image                varchar(200),
    short_desc           varchar(50),
    carried_quantity     integer,
    product_details_id   integer,
    foreign key (product_details_id) references product_details(product_details_id)
  );

  create table shopping_cart (
    cart_id      integer primary key AUTO_INCREMENT,
    product_id   integer,
    user_id      integer,
    quantity     integer,
    foreign key (product_id) references product(product_id),
    foreign key (user_id) references user(user_id)
  );
