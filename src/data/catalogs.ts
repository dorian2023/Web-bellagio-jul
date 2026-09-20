/**
 * @file catalogs.ts
 * @description Real catalog and categories data synchronized with Supabase database for Muebles Bellagio.
 * Contains 76 real products.
 */

import { Category, Product } from '@/src/types/catalog';

export const CATEGORIES_DATA: Category[] = [
  {
    "id": "todos",
    "name": "Todas las Categorías",
    "count": 76
  },
  {
    "id": "box-spring",
    "name": "Box Spring",
    "count": 0
  },
  {
    "id": "ceibos",
    "name": "Ceibos",
    "count": 2
  },
  {
    "id": "closet",
    "name": "Closet",
    "count": 0
  },
  {
    "id": "comedores",
    "name": "Comedores",
    "count": 15
  },
  {
    "id": "dormitorios",
    "name": "Dormitorios",
    "count": 16
  },
  {
    "id": "espejos",
    "name": "Espejos",
    "count": 1
  },
  {
    "id": "gaveteros",
    "name": "Gaveteros",
    "count": 2
  },
  {
    "id": "mesas-de-centro",
    "name": "Mesas de Centro",
    "count": 0
  },
  {
    "id": "mesas-de-noche",
    "name": "Mesas de Noche",
    "count": 6
  },
  {
    "id": "mesas-tv",
    "name": "Mesas Tv",
    "count": 0
  },
  {
    "id": "peinadoras",
    "name": "Peinadoras",
    "count": 3
  },
  {
    "id": "poltronas",
    "name": "Poltronas",
    "count": 5
  },
  {
    "id": "sillas",
    "name": "Sillas",
    "count": 1
  },
  {
    "id": "sofacamas",
    "name": "Sofacamas",
    "count": 9
  },
  {
    "id": "sofas",
    "name": "Sofas",
    "count": 11
  },
  {
    "id": "taburete",
    "name": "Taburete",
    "count": 5
  },
  {
    "id": "zapateras",
    "name": "Zapateras",
    "count": 0
  }
];

export const CATALOGS_DATA: Product[] = [
  {
    "id": "2152e4e9-f5b9-4dfc-9964-0e58a6286b72",
    "category": "espejos",
    "categoryName": "Espejos",
    "title": "Espejo 3 Gotas",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/9ece3a5a-11e4-4f6c-a3ac-674423e27f7a-1789690011893.webp",
    "availableColors": []
  },
  {
    "id": "e84d9c53-dd23-4ba2-9755-967dc6287e81",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Duplex Sasha",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/abc24531-3e43-494a-b337-3513fe5033d3-1789689762859.webp",
    "availableColors": []
  },
  {
    "id": "f1975820-c2a4-4d82-ad05-7e9fdeb64613",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Prado",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/229469ca-a18e-49a8-9c1f-8ef56a003c06-1789348763357.webp",
    "availableColors": []
  },
  {
    "id": "3097eac0-aa5e-4268-a82d-b3f7b7ef976f",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Paris",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/ea3fb21d-449f-4525-ae3e-6384affe3231-1789348533437.webp",
    "availableColors": []
  },
  {
    "id": "78534695-d96d-4204-8cf1-9ca4d3c87654",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Nike",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/6c3d5928-e440-456a-9d7e-5dd3124815d4-1789348142308.webp",
    "availableColors": []
  },
  {
    "id": "0bb765d3-7207-43ce-8b3b-2f8082429a24",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Nápoles",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/1b2f9ff6-a20a-4bea-90fd-a22f031ca3eb-1789348002202.webp",
    "availableColors": []
  },
  {
    "id": "cbb2a7a6-44ca-42c3-803c-1c395e582d73",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Leo",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/700d35f1-403a-4f99-8149-7ba990e929b1-1789347786177.webp",
    "availableColors": []
  },
  {
    "id": "7c69428f-1628-458a-abe7-b00c9c7dd3b4",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Jardinera",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/e8226f5c-822a-4557-85a3-9680684c47db-1789347597293.webp",
    "availableColors": []
  },
  {
    "id": "e9154bf5-4880-485a-81be-b669078945ca",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Infinito",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/306845af-9b02-4330-ab28-f734102a8ee7-1789347475915.webp",
    "availableColors": []
  },
  {
    "id": "a1afb6c0-0bc0-45d8-9d18-a32871b3aef9",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Foster",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/cbf4f961-962f-4055-ac9b-8c413b246a33-1789347333639.webp",
    "availableColors": []
  },
  {
    "id": "7d3bc226-c6ac-4ec2-a43a-f35f9d347c7d",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Davinci",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/7d3bc226-c6ac-4ec2-a43a-f35f9d347c7d-1789689552693.webp",
    "availableColors": []
  },
  {
    "id": "151aac9e-b0e5-485f-bf03-05c47222a9b8",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Belkis",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/f25189d8-f454-43a4-9bf9-04689cf54736-1789346889781.webp",
    "availableColors": []
  },
  {
    "id": "3cc4387e-5780-4244-9551-bb2d8ea08b1b",
    "category": "taburete",
    "categoryName": "Taburete",
    "title": "Silla Bar Foster",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/9e4a01e3-19e9-4434-af93-d1154ae1d258-1789346728247.webp",
    "availableColors": []
  },
  {
    "id": "d47b10cf-fcee-4476-92c1-6d3cb1b3fb4b",
    "category": "taburete",
    "categoryName": "Taburete",
    "title": "Silla Bar Angeline",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/3a22ae06-f873-43fd-b5b0-cca4cd698f38-1789346576891.webp",
    "availableColors": []
  },
  {
    "id": "c5dccc77-e08c-45cc-8791-4d492443c7d5",
    "category": "taburete",
    "categoryName": "Taburete",
    "title": "Silla Bar Anastasia",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/31401b9a-9268-447c-8ade-5048139f599e-1789346434049.webp",
    "availableColors": []
  },
  {
    "id": "cd667e4c-b249-4271-8b7b-75870c076c45",
    "category": "taburete",
    "categoryName": "Taburete",
    "title": "Silla Bar Ambar",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/6790d904-1ec8-4dc9-bc14-6a8d1f928619-1789346324239.webp",
    "availableColors": []
  },
  {
    "id": "ececa144-1226-4ab0-9e3f-771d237fe925",
    "category": "ceibos",
    "categoryName": "Ceibos",
    "title": "Ceibo Luna",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/ac98acfa-9120-42a3-bbed-86efc3f98aa3-1789346156153.webp",
    "availableColors": []
  },
  {
    "id": "debd9ec7-a50c-426f-b3a3-220a8e96b4d9",
    "category": "ceibos",
    "categoryName": "Ceibos",
    "title": "Ceibo Diamante",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/f347d806-b63b-407f-a873-a392728391aa-1789345985712.webp",
    "availableColors": []
  },
  {
    "id": "820d7d6e-bccc-4cfd-a4ea-03b2439d4ad2",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Axium",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/893cae68-6154-46be-aa17-9026efff1192-1789345852605.webp",
    "availableColors": []
  },
  {
    "id": "45f38d2d-3762-4590-b7c1-043b4989671e",
    "category": "gaveteros",
    "categoryName": "Gaveteros",
    "title": "Consola Axium",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/fece6a1c-b79b-495b-a9a8-f4ce571796b7-1789345634963.webp",
    "availableColors": []
  },
  {
    "id": "f2da97a6-d721-4c73-9c66-a5c47edd8d1e",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Alma",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/d8daa446-9d8f-4f4f-b502-983be267da0f-1789345490124.webp",
    "availableColors": []
  },
  {
    "id": "fef203f7-43c1-4793-8bb8-7418603de02b",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama New York",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/2c4ffc3a-cb36-4560-8d96-efd5cf4ff8af-1789345343112.webp",
    "availableColors": []
  },
  {
    "id": "ce81b5e3-c5e5-4c0f-bdb8-3f76ec2e5c7d",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Seul Modular",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/d087c63e-c044-45ea-8242-de0747b4eaed-1789345162491.webp",
    "availableColors": []
  },
  {
    "id": "2631c133-7ae5-44e0-a34c-9aba16868a2a",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Berlin 3 posiciones",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/f68ce9fe-f1df-4574-9558-7b68f04457fa-1789345039223.webp",
    "availableColors": []
  },
  {
    "id": "ae20bab1-9f5b-4d7a-8315-9769dccae9b8",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Berlin 2 posiciones",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/ebceb651-761b-4714-8001-10f5ea237da3-1789344996314.webp",
    "availableColors": []
  },
  {
    "id": "ce5060c9-531d-4f2a-a46a-2d739366448a",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Denver",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/b9687e3d-a4ba-4f19-a2dd-648a97bfce8c-1789344819257.webp",
    "availableColors": []
  },
  {
    "id": "ee3e9827-a375-47ea-882c-fb5cd4ad458e",
    "category": "gaveteros",
    "categoryName": "Gaveteros",
    "title": "Gavetero Ilussion",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/af8ce016-0833-4f18-b7c8-5eab75e2ccce-1789344688932.webp",
    "availableColors": []
  },
  {
    "id": "edb2bdca-3bc6-44de-a746-6ab3d3e11180",
    "category": "peinadoras",
    "categoryName": "Peinadoras",
    "title": "Peinadora Ilussion",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/da3f4d27-3938-49e3-9599-3beab40735bd-1789344447542.webp",
    "availableColors": []
  },
  {
    "id": "6eceba2a-1c1c-4551-9af8-8710e156d14c",
    "category": "peinadoras",
    "categoryName": "Peinadoras",
    "title": "Peinadora Diamante",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/40ed83f9-2b74-4165-8ccc-d8ac9d5ce530-1789344338648.webp",
    "availableColors": []
  },
  {
    "id": "569bfe1f-bacf-42b4-b2b1-d1d9990f011b",
    "category": "peinadoras",
    "categoryName": "Peinadoras",
    "title": "Peinadora Camerino",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/22a0f2fd-534d-4560-8f09-5b31799c08da-1789344216008.webp",
    "availableColors": []
  },
  {
    "id": "ba177d21-7afe-47fd-80bc-1d207cd073d4",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor Alba",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/70e0652c-346d-4df3-8c32-81739e01fd4c-1789344143408.webp",
    "availableColors": []
  },
  {
    "id": "499ef048-dbc6-4ae3-9328-71110ec568cc",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Alba",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/41ee1a2b-b6a0-45b6-96fd-89434d863448-1789344015240.webp",
    "availableColors": []
  },
  {
    "id": "d7842277-fed1-4711-8801-1a5996972c76",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Jade",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/4d58f641-57ae-44a4-b50f-829ed1505098-1789343802075.webp",
    "availableColors": []
  },
  {
    "id": "51cae37d-32d2-4170-86de-b5c700870cfb",
    "category": "mesas-de-noche",
    "categoryName": "Mesas de Noche",
    "title": "Mesa de Noche Aluminio",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/c39a47a4-8f57-4493-937b-4a779110fd2a-1789343541896.webp",
    "availableColors": []
  },
  {
    "id": "610767d7-7181-4a29-af6e-37df369a0331",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Dormitorio Aluminio",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/610767d7-7181-4a29-af6e-37df369a0331-1789343460379.webp",
    "availableColors": []
  },
  {
    "id": "c368792e-9e4b-4ffd-97ad-e9c5f0fe098d",
    "category": "mesas-de-noche",
    "categoryName": "Mesas de Noche",
    "title": "Mesa de Noche Topkapi",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/7fe5f392-4ba7-4b9d-8fb9-c2ac2cd1e9de-1789343328150.webp",
    "availableColors": []
  },
  {
    "id": "51c9478d-02cf-46b8-9e07-e2d6674da857",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Marbella Puff Suelto",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/3fbc2297-daf3-4dd4-8edf-91c3af164cbd-1789343223864.webp",
    "availableColors": []
  },
  {
    "id": "6f88780b-b3e6-46c3-bf71-750e3f77a825",
    "category": "mesas-de-noche",
    "categoryName": "Mesas de Noche",
    "title": "Mesa de Noche Aruba",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/1984fcd1-0302-4795-82c0-05b56f94c596-1789343140976.webp",
    "availableColors": []
  },
  {
    "id": "b80dd9d1-6619-4623-9168-e116a06e1aec",
    "category": "mesas-de-noche",
    "categoryName": "Mesas de Noche",
    "title": "Mesa de Noche Pegasus",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/450043b5-a6b7-4bdc-a0fb-6726cd9987ee-1789342993648.webp",
    "availableColors": []
  },
  {
    "id": "d2c9008d-8a95-49e9-a6b4-c7277fac49c5",
    "category": "sillas",
    "categoryName": "Sillas",
    "title": "Silla Esperanza II",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/ba06e8c1-1d7b-47d2-a2dc-57454a463367-1789342873769.webp",
    "availableColors": []
  },
  {
    "id": "962cfba9-3bde-41cf-81dc-8c00664ae629",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Baul Lindo",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/f2bd1a70-e486-4d5c-8cbc-c671822e7c60-1789342801246.webp",
    "availableColors": []
  },
  {
    "id": "c2a098cc-177e-4034-967c-d3007b8ecf25",
    "category": "poltronas",
    "categoryName": "Poltronas",
    "title": "Poltrona Togo",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/d1678915-b3fc-4acf-bd43-c8a8b39ecd49-1789342731820.webp",
    "availableColors": []
  },
  {
    "id": "ac193eed-4543-4d5b-a764-a3ae2b11f88f",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Honda",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/5a230f4b-430a-4dd4-b6e7-f86de69217b4-1789342641109.webp",
    "availableColors": []
  },
  {
    "id": "e039e208-59c5-47ab-8834-f9c21dcf7add",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Dormitorio Vanessa",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/fa2e9412-a3ed-4186-b42b-b17a69a24340-1789342609513.webp",
    "availableColors": []
  },
  {
    "id": "ff345ffc-b0b7-4718-b33d-bfdd1a023fb6",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Elegance",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/4fa02ce0-0bdd-4f7e-a7ca-8638ff94821f-1789342532181.webp",
    "availableColors": []
  },
  {
    "id": "1119123c-2382-4aeb-8815-fd41a48bebe6",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Nexus",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/64cb8afe-c44a-4fea-af4c-ba461e8b3376-1789342475434.webp",
    "availableColors": []
  },
  {
    "id": "87c718ad-7239-4ce5-a273-dbb8b7bda586",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor 115",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "Tope: 1.40 x 0.80 metros",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/87c718ad-7239-4ce5-a273-dbb8b7bda586-1789342428614.webp",
    "availableColors": []
  },
  {
    "id": "0ec9d4ce-705e-47fd-9acd-5fa08f9ed6f8",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Lumy",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/8b783dfa-5e53-4a3a-9292-ed610508157a-1789342288891.webp",
    "availableColors": []
  },
  {
    "id": "6afff82d-b93a-443f-8298-555723a7b278",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Salome",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/11d44742-fa04-4cbe-b494-f0382aa9c1db-1789342239681.webp",
    "availableColors": []
  },
  {
    "id": "20e5e5ce-07fa-41b8-8962-e7824e703a56",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Nicol",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/60a8f74b-0f47-4df0-9988-fd3abc0a7079-1789342203127.webp",
    "availableColors": []
  },
  {
    "id": "9d0c2182-1c87-42ca-a2ff-1b8459fb6f65",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Nube Catania",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/3cbfeb81-eef9-4804-9f7e-6e28db2bb610-1789342146439.webp",
    "availableColors": []
  },
  {
    "id": "454bd975-ea13-4868-b7e3-a907535a6f8d",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Elena",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/0fee5690-a248-40f8-93e7-5649db59fe46-1789342046115.webp",
    "availableColors": []
  },
  {
    "id": "58077e75-d839-4503-bfe2-72fde9e4556e",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor J-020 Extensible",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/fe75b6ef-0078-4d7c-829a-bbee0193e8f9-1789341996359.webp",
    "availableColors": []
  },
  {
    "id": "cc3ef248-f57b-4f18-8911-9f8f65ceabc0",
    "category": "mesas-de-noche",
    "categoryName": "Mesas de Noche",
    "title": "Mesa de Noche Emperatriz",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/ce459ffe-c7f1-4886-a88c-25f2a211647f-1789341934754.webp",
    "availableColors": []
  },
  {
    "id": "079ac341-18b1-47c9-a461-2a1af64b347c",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Ferrara",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "2.40 X 1.60 METROS.",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/c204c6a2-2c74-4a18-aef0-9b1580a3bec1-1789341889192.webp",
    "availableColors": [
      "Varios"
    ]
  },
  {
    "id": "0713c4c9-4f1d-41ba-8f4a-22398135cf7d",
    "category": "taburete",
    "categoryName": "Taburete",
    "title": "Silla Bar Genesis",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/5016763e-b344-44e3-a92e-23f6fb9577cc-1789341754075.webp",
    "availableColors": []
  },
  {
    "id": "97b4475e-ecd4-42c8-b344-56588a2db654",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Aureo",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/8c50d180-8de5-4122-98bf-15ab768247d1-1789341639437.webp",
    "availableColors": []
  },
  {
    "id": "8f9392fb-081b-49da-8270-0cd504f51709",
    "category": "poltronas",
    "categoryName": "Poltronas",
    "title": "Poltrona New York Reclinable",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/1c8cd3a7-ef2c-44a2-b85f-34dbe7ad50f5-1789341571620.webp",
    "availableColors": []
  },
  {
    "id": "56a0322f-bada-4222-bc2f-28d2e3fd2d4d",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Sofia",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/ba78f829-4999-4122-ae1b-558bcaec6093-1789341492398.webp",
    "availableColors": []
  },
  {
    "id": "26ec5238-d851-4f29-9219-e95435b3a7ba",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Sofa Nexus",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "2.10 X 1.05 metros",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/bb8c971e-18d8-4308-9f4d-987524b3f0c0-1789341409825.webp",
    "availableColors": []
  },
  {
    "id": "47a59ec9-e57a-446c-9066-00f2a2a8f117",
    "category": "mesas-de-noche",
    "categoryName": "Mesas de Noche",
    "title": "Mesa de Noche MH-630",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/b77b6523-0ec4-4e3d-aac7-a3bfca876b73-1789341294228.webp",
    "availableColors": []
  },
  {
    "id": "261a342f-7f6d-42ef-89d8-604fed18b70c",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Nube Dado",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/261a342f-7f6d-42ef-89d8-604fed18b70c-1789341233108.webp",
    "availableColors": []
  },
  {
    "id": "f8bdb677-6f71-4927-a111-b4465d900f00",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Chanel",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/c094a00d-e9c1-44e7-96b9-8a8e4b1bc44c-1789341147954.webp",
    "availableColors": []
  },
  {
    "id": "e0862852-1762-4427-91b5-70ad292a68aa",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Aruba",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "Individual, Matrimonial, Queen, King, COPETE: altura 1.60 metros.",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/7e9dc849-41a3-40ca-b5cf-c0eb23268289-1789341061244.webp",
    "availableColors": []
  },
  {
    "id": "e0c6529e-8329-47ac-95b6-353d4ca3fc04",
    "category": "poltronas",
    "categoryName": "Poltronas",
    "title": "Poltrona Chanel",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/9958782f-457e-4dd7-8098-323ef6359117-1789340845840.webp",
    "availableColors": []
  },
  {
    "id": "64140ce0-18f2-4ee7-9a85-4bb9b6c545c6",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Torino",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/64140ce0-18f2-4ee7-9a85-4bb9b6c545c6-1789340772092.webp",
    "availableColors": []
  },
  {
    "id": "287b5616-d0c8-4f76-85ef-35995813c57b",
    "category": "poltronas",
    "categoryName": "Poltronas",
    "title": "Poltrona Primola",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/287b5616-d0c8-4f76-85ef-35995813c57b-1789690050390.webp",
    "availableColors": []
  },
  {
    "id": "d0810c5e-fca1-4278-ae20-b432b60b3fd5",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Nube",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/7a410eee-09b6-4da8-a6e8-30b0b41cb6d5-1789241839518.webp",
    "availableColors": []
  },
  {
    "id": "e46f7ba9-23b9-404d-a1c4-0175571bb520",
    "category": "sofacamas",
    "categoryName": "Sofacamas",
    "title": "Sofa cama Siena",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/e02d9565-f91a-4ca0-8587-12fabe763f2c-1789241679953.webp",
    "availableColors": [
      "Varios"
    ]
  },
  {
    "id": "568aa250-c83b-4389-9651-b8003ddb985c",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Sofa Portugal",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "Sofa 3 puestos: 2.00 x 0.90 metros. Sofa 2 puestos: 1.65 x 0.90 metros.",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/8d165759-e587-4faf-8c6f-dbe562dd95c5-1789241411802.webp",
    "availableColors": []
  },
  {
    "id": "ef34606e-6653-4ce4-a0bc-8c7e7b764b64",
    "category": "poltronas",
    "categoryName": "Poltronas",
    "title": "Poltrona Portugal",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/cf735f1f-1536-4472-9d92-c69b6d61b27f-1789241322175.webp",
    "availableColors": []
  },
  {
    "id": "e205e31a-3461-45e1-a1c8-b0da4c441a69",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Dormitorio Emperatriz",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "Individual, Matrimonial, Queen, King. Copete: Altura 1.40 metros",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/bddb5c2b-8fa3-42ef-8c81-9eced27274ba-1789241251845.webp",
    "availableColors": [
      "Blanco",
      "Negro"
    ]
  },
  {
    "id": "fc19b2c9-e92c-4909-8afc-372667734706",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Aluminio",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "Individual, Matrimonial, Queen, King. Copete: Altura 1.20 metros",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/d2ec5a57-fc8f-4b6a-9863-5663caedd6d6-1789240262533.webp",
    "availableColors": []
  },
  {
    "id": "b46ae24e-7788-4485-b614-95576ccd7e72",
    "category": "dormitorios",
    "categoryName": "Dormitorios",
    "title": "Cama Topkapi",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "Individual, Matrimonial, Queen, King. Copete: Altura 2.50 metros",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/c2ad7730-a8f9-43a9-8830-5921a0e6c724-1789240210766.webp",
    "availableColors": []
  },
  {
    "id": "6858ae89-374f-41e6-9d5e-f287f560dcdd",
    "category": "sofas",
    "categoryName": "Sofas",
    "title": "Modular Marbella",
    "subtitle": "",
    "description": "",
    "materials": "Estructura de madera de pino seco al horno, tapizado en tela con patas metálicas.",
    "dimensions": "3 puestos + Canapes: 3.00 X 2.10 Metros.",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/ab8a2c55-a245-4f33-af59-b21f98257844-1789156515433.webp",
    "availableColors": []
  },
  {
    "id": "6cff4596-6666-4925-8940-c62924e0e500",
    "category": "comedores",
    "categoryName": "Comedores",
    "title": "Comedor JH314-12 Extensible",
    "subtitle": "",
    "description": "",
    "materials": "",
    "dimensions": "Normal: 1.20 x 0.80 metros. Extendido: 1.50 x 0.80 metros",
    "image": "https://yxtazqlqwhsxppsipwet.supabase.co/storage/v1/object/public/product-images/products/6a5dd809-b202-4052-9ff1-b48a48d2b11a-1789156315192.webp",
    "availableColors": [
      "Sillas Negras"
    ]
  }
];
