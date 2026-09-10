-- ============================================================
-- MIGRACIÓN DE LA HISTORIA DEL BARRIO VILAFRANCA
-- Generada automáticamente desde src/content/history.ts
-- ============================================================

BEGIN;

-- ============================================================
-- VERIFICACIÓN PREVIA
-- ============================================================
SELECT COUNT(*) AS chapters_before FROM history_chapters;
SELECT COUNT(*) AS blocks_before FROM history_blocks;


-- ============================================================
-- Capítulo I
-- ============================================================
DO $$
DECLARE
  chapter_1 uuid;
BEGIN
  SELECT id INTO chapter_1
  FROM history_chapters
  WHERE title = 'Capítulo I' AND subtitle = 'Los comienzos de una historia de fe'
  LIMIT 1;

  IF chapter_1 IS NULL THEN
    INSERT INTO history_chapters (
      title,
      subtitle,
      year,
      content,
      cover_image,
      order_index,
      status
    ) VALUES (
      'Capítulo I',
      'Los comienzos de una historia de fe',
      NULL,
      'Toda gran historia comienza con unas pocas personas dispuestas a seguir al Señor. Así nació el Barrio Vilafranca.',
      '/images/history/capitulo1.jpg',
      1,
      'approved'
    )
    RETURNING id INTO chapter_1;

    RAISE NOTICE 'Capítulo creado: %', chapter_1;

    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'quote',
      'Toda gran historia comienza con unas pocas personas dispuestas a seguir al Señor. Así nació el Barrio Vilafranca.',
      NULL,
      0
    );

    -- Sección: Los primeros pasos
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Alrededor del año 1978 
Mucho antes de que existiera el Barrio Vilafranca, los miembros de La Iglesia de Jesucristo de los Santos de los Últimos Días que vivían en esta zona pertenecían al Distrito de Tarragona. En aquellos años era necesario desplazarse hasta Reus para asistir a las reuniones dominicales.

A finales de los años setenta comenzaron a llegar los primeros misioneros a Vilafranca del Penedès. Gracias a su labor, varias familias conocieron el Evangelio restaurado y decidieron unirse a la Iglesia.

Entre los primeros conversos se encontraban las familias Pons, Moya y Farricas.

Las primeras reuniones se celebraban en hogares particulares. Con el paso del tiempo, el número de miembros fue creciendo y surgió la necesidad de disponer de un lugar donde reunirse con mayor regularidad.

Gracias a la fe y al esfuerzo de aquellos primeros santos, comenzó a formarse una comunidad cada vez más fuerte y unida que prepararía el camino para el nacimiento de la Rama Vilafranca.',
      'Los primeros pasos',
      1
    );

    -- Sección: El nacimiento de la Rama Vilafranca
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      '8 de julio de 1990
El 8 de julio de 1990 se organizó oficialmente la Rama Vilafranca, marcando el inicio de una nueva etapa para los miembros de la comarca.

Las reuniones dominicales se celebraban de 10:00 a 13:00 horas.

Mientras se obtenían los permisos para un lugar de reuniones permanente, la rama comenzó reuniéndose en el garaje del hermano Varela, donde se celebraban la reunión sacramental y las diferentes clases.

Aquel primer domingo asistieron aproximadamente 30 personas, aunque el núcleo inicial estaba formado por unas 25.

Primeras familias:
• Familia Varela
• Familia Pérez
• Familia Moya
• Familia Rojano
• Verónica Varela
• Mari Varela
• Ángela Moya y Luis Sales
• Lucy Moya

La llegada de la familia Porras permitió consolidar definitivamente la nueva rama gracias al importante número de miembros que aportaron.',
      'El nacimiento de la Rama Vilafranca',
      11
    );

    -- Sección: El primer liderazgo
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      '27 de Enero de 1991
El 27 de enero de 1991 se organizó el primer liderazgo de la Rama Vilafranca.

El primer presidente de la Rama Vilafranca fue Francisco Ibáñez.

Uno de sus consejeros fue Luis Sales, quien además servía como asesor de la Primaria.

Durante aquellos primeros años comenzaron a organizarse los llamamientos necesarios para el funcionamiento de la nueva unidad.

Primeros llamamientos:',
      'El primer liderazgo',
      21
    );

    -- Tarjeta: Presidente de Escuela Dominical
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Padre de Mari Moya',
      'card:Presidente de Escuela Dominical',
      23
    );

    -- Tarjeta: Presidenta Sociedad de Socorro
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'María Ángeles Porras',
      'card:Presidenta Sociedad de Socorro',
      24
    );

    -- Tarjeta: Consejera Sociedad de Socorro
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Ángela Moya',
      'card:Consejera Sociedad de Socorro',
      25
    );

    -- Tarjeta: Presidenta de Primaria
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Mari Moya',
      'card:Presidenta de Primaria',
      26
    );

    -- Sección: Los primeros años
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Las instalaciones eran muy sencillas.

Las clases de Primaria se realizaban utilizando la cocina, un pequeño cuarto junto al garaje y diferentes habitaciones de la vivienda del hermano Varela.

Muchos miembros no disponían de vehículo propio, por lo que varios hermanos organizaban turnos para recoger a las familias y llevarlas a las reuniones dominicales.

Aquellos sacrificios fortalecieron la unidad y el amor entre los miembros.',
      'Los primeros años',
      31
    );

    -- Sección: La primera capilla
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      '23 de febrero de 1992

La Rama Vilafranca pudo trasladarse a su primer local de reuniones.

La capilla estaba situada en la calle Amàlia Soler, donde la Iglesia alquilaba toda la primera planta del edificio.

Su cercanía a la estación facilitó enormemente la asistencia de los miembros.

Este traslado representó un paso decisivo en la consolidación de la Iglesia en Vilafranca.',
      'La primera capilla',
      41
    );

    -- Galería: La primera capilla
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'gallery',
      '["/images/history/primera-capilla-1.jpg","/images/history/primera-capilla-2.jpg","/images/history/primera-capilla-3.jpg"]',
      'La primera capilla',
      42
    );

    -- Sección: La organización de la Primaria
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Una de las organizaciones más activas desde los primeros años fue la Primaria.

Presidencia:

• Presidenta: María Moya
• Consejera: Ángela Moya

Maestros:

• Haz lo Justo y Valientes — José Varela
• Estrellita y Rayitos — Luis Sales',
      'La organización de la Primaria',
      51
    );

    -- Sección: Presidentes de Rama
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      '11 de noviembre de 2007
Guillermo Pinto fue el último presidente de la Rama Vilafranca antes de la reorganización de la unidad.
Durante su presidencia la rama se trasladó a un edificio más amplio para atender el crecimiento de la congregación.

A lo largo de los años sirvieron como presidentes de la Rama Vilafranca:',
      'Presidentes de Rama',
      61
    );

    -- Tarjeta: 1990
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Francisco Ibáñez',
      'card:1990',
      63
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Ferrán Silvestre',
      'card:Posteriormente',
      64
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Luis Sales',
      'card:Posteriormente',
      65
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Francesc Urpí',
      'card:Posteriormente',
      66
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Hno. Rojano',
      'card:Posteriormente',
      67
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Antonio Ibáñez',
      'card:Posteriormente',
      68
    );

    -- Tarjeta: 2007
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Guillermo Pinto',
      'card:2007',
      69
    );

    -- Sección: El nacimiento del Barrio Vilafranca
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      '20 de enero de 2013

El crecimiento constante de miembros hizo posible un momento histórico.

La Rama Vilafranca fue organizada oficialmente como Barrio Vilafranca.

Este acontecimiento marcó un antes y un después en la historia del barrio y simbolizó la madurez alcanzada por la Iglesia en Vilafranca.',
      'El nacimiento del Barrio Vilafranca',
      71
    );

    -- Tarjeta: Primer Obispo
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Pere Borrut',
      'card:Primer Obispo',
      73
    );

    -- Tarjeta: Primer Consejero
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'José Luis Cruz',
      'card:Primer Consejero',
      74
    );

    -- Tarjeta: Segundo Consejero
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Albuquerque',
      'card:Segundo Consejero',
      75
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Guillermo Pinto',
      'card:Posteriormente',
      76
    );

    -- Sección: Los primeros misioneros
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Entre los primeros misioneros que salieron desde la Rama Vilafranca se encuentran:',
      'Los primeros misioneros',
      81
    );

    -- Tarjeta: Primeros misioneros
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Lucía Moya',
      'card:Primeros misioneros',
      83
    );

    -- Tarjeta: Primeros misioneros
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Francisco Rojano',
      'card:Primeros misioneros',
      84
    );

    -- Tarjeta: Primeros misioneros
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Judith Rojano',
      'card:Primeros misioneros',
      85
    );

    -- Tarjeta: Primeros misioneros
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Javier Porras',
      'card:Primeros misioneros',
      86
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Hnos. Becerra',
      'card:Posteriormente',
      87
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Javier Cruz',
      'card:Posteriormente',
      88
    );

    -- Tarjeta: Posteriormente
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_1,
      'text',
      'Laura Silvestre',
      'card:Posteriormente',
      89
    );

  ELSE
    RAISE NOTICE 'El capítulo ya existe: %', chapter_1;
  END IF;
END $$;


-- ============================================================
-- Capítulo II
-- ============================================================
DO $$
DECLARE
  chapter_2 uuid;
BEGIN
  SELECT id INTO chapter_2
  FROM history_chapters
  WHERE title = 'Capítulo II' AND subtitle = 'Un período de crecimiento y grandes bendiciones (2015–2019)'
  LIMIT 1;

  IF chapter_2 IS NULL THEN
    INSERT INTO history_chapters (
      title,
      subtitle,
      year,
      content,
      cover_image,
      order_index,
      status
    ) VALUES (
      'Capítulo II',
      'Un período de crecimiento y grandes bendiciones (2015–2019)',
      NULL,
      'La fe de un barrio no solo se refleja en los edificios que construye, sino en las personas que sirven al Señor cada día.',
      '/images/history/capitulo2.jpeg',
      2,
      'approved'
    )
    RETURNING id INTO chapter_2;

    RAISE NOTICE 'Capítulo creado: %', chapter_2;

    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'quote',
      'La fe de un barrio no solo se refleja en los edificios que construye, sino en las personas que sirven al Señor cada día.',
      NULL,
      0
    );

    -- Sección: La obra de Historia Familiar
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'En 2015 la Historia Familiar se había convertido en una parte importante de la vida del Barrio Vilafranca.

Cada semana, generalmente los sábados, los miembros se reunían para buscar a sus antepasados y ayudar a otras personas a preparar nombres para el templo.

Esta labor era coordinada por Ángela Duque y Francisco Ibáñez Marruecos.

"La historia familiar está bajo la influencia del Espíritu de Elías."

— Francisco Ibáñez (2015)

Para muchos miembros, la obra vicaria dejó de ser simplemente una tarea para convertirse en una experiencia profundamente espiritual que fortaleció su testimonio.',
      'La obra de Historia Familiar',
      1
    );

    -- Tarjeta: Coordinadora de Historia Familiar
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Ángela Duque',
      'card:Coordinadora de Historia Familiar',
      3
    );

    -- Tarjeta: Coordinador de Historia Familiar
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Francisco Ibáñez Marruecos',
      'card:Coordinador de Historia Familiar',
      4
    );

    -- Sección: El sueño de una capilla propia
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Desde la creación del Barrio Vilafranca en 2013 nació un sueño compartido: contar con una capilla propia.

Durante años los miembros ayunaron, oraron y trabajaron unidos para hacerlo realidad.

El obispo Pere Borrut, junto con el presidente de estaca Ferran Silvestre, lideraron las gestiones necesarias para conseguir los permisos de construcción.',
      'El sueño de una capilla propia',
      11
    );

    -- Tarjeta: Obispo
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Pere Borrut',
      'card:Obispo',
      13
    );

    -- Tarjeta: Presidente de Estaca
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Ferran Silvestre',
      'card:Presidente de Estaca',
      14
    );

    -- Sección: 28 de mayo de 2016 — La primera palada
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Uno de los días más importantes de la historia del barrio.

Después de años de oración y esfuerzo se realizó la ceremonia de la primera palada para comenzar la construcción de la nueva capilla.

Participaron miembros del barrio, líderes de la Estaca Hospitalet, autoridades civiles y numerosos vecinos de Vilafranca.

Durante la ceremonia se enterró una cápsula del tiempo con:

• Un periódico del día.
• Monedas en circulación.
• Fotografías del barrio.
• Un Libro de Mormón dedicado por el obispo.
• Una placa conmemorativa colocada por el presidente de misión, Presidente Dayton.',
      '28 de mayo de 2016 — La primera palada',
      21
    );

    -- Galería: 28 de mayo de 2016 — La primera palada
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'gallery',
      '["/images/history/primera-palada-1.jpg","/images/history/primera-palada-2.jpg","/images/history/primera-palada-3.jpg"]',
      '28 de mayo de 2016 — La primera palada',
      22
    );

    -- Tarjeta: Presidente de Misión
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Presidente Dayton',
      'card:Presidente de Misión',
      23
    );

    -- Sección: Compartiendo el Evangelio
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Cada año el barrio participaba en la celebración de Sant Jordi regalando ejemplares del Libro de Mormón y respondiendo preguntas de las personas interesadas en conocer la Iglesia.

En una de estas actividades se entregó un Libro de Mormón al alcalde de Vilafranca.',
      'Compartiendo el Evangelio',
      31
    );

    -- Galería: Compartiendo el Evangelio
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'gallery',
      '["/images/history/sant-jordi-1.jpg","/images/history/sant-jordi-2.jpg"]',
      'Compartiendo el Evangelio',
      32
    );

    -- Sección: Fiesta del Voluntariado
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Durante los años 2015 y 2016 el barrio participó en la Fiesta del Voluntariado de Vilafranca.

Los miembros fueron reconocidos por su servicio y compromiso con la comunidad.',
      'Fiesta del Voluntariado',
      41
    );

    -- Sección: Un tiempo de transición
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      '8 de octubre de 2017

Última reunión sacramental en la capilla de la calle Garraf.

Octubre de 2017

Reuniones temporales en el Hotel Sercotel Pere III.

Octubre de 2017 – Octubre de 2018

El barrio se reunió en un pequeño local provisional mientras finalizaban las obras de la nueva capilla.

Durante este período también se celebró la boda de Sonia y Ángel.',
      'Un tiempo de transición',
      51
    );

    -- Sección: La nueva capilla
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      '4 de noviembre de 2018

Se celebró la primera reunión sacramental en la nueva capilla.

Pocos días después tuvo lugar la sexta conferencia del barrio.',
      'La nueva capilla',
      61
    );

    -- Galería: La nueva capilla
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'gallery',
      '["/images/history/nueva-capilla-1.jpg","/images/history/nueva-capilla-2.jpg","/images/history/nueva-capilla-3.jpg"]',
      'La nueva capilla',
      62
    );

    -- Sección: Cambios en el obispado
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      '14 de abril de 2019

La presidencia del obispado quedó formada por:',
      'Cambios en el obispado',
      71
    );

    -- Tarjeta: Obispo
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Pere Borrut',
      'card:Obispo',
      73
    );

    -- Tarjeta: Primer consejero
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Mario Pinto',
      'card:Primer consejero',
      74
    );

    -- Tarjeta: Segundo consejero
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Jhonatan Suncion Ríos',
      'card:Segundo consejero',
      75
    );

    -- Sección: Una capilla para toda la comunidad
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'La nueva capilla fue concebida como un lugar abierto al servicio de toda la ciudad.

Además de las reuniones de la Iglesia, ha acogido actividades deportivas, culturales y comunitarias.

Un ejemplo fue el ensayo realizado por la Coral del Centre Excursionista Penedès.',
      'Una capilla para toda la comunidad',
      81
    );

    -- Sección: 9 de junio de 2019 — Dedicación de la nueva capilla
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'El 9 de junio de 2019 quedó oficialmente inaugurada la nueva capilla del Barrio Vilafranca.

Fue un día profundamente emotivo para todos los miembros que habían trabajado durante años para hacer realidad este sueño.

El obispo Pere Borrut expresó:

"Hoy se cierra un ciclo emocionante y el Señor ha hecho posible lo que hace pocos años parecía un sueño inalcanzable."

La inauguración simbolizó la fe, el sacrificio y la unidad de generaciones de miembros que contribuyeron a construir no solo un edificio, sino un verdadero hogar espiritual para las familias de Vilafranca.',
      '9 de junio de 2019 — Dedicación de la nueva capilla',
      91
    );

    -- Tarjeta: Obispo
    INSERT INTO history_blocks (
      chapter_id,
      type,
      content,
      caption,
      order_index
    ) VALUES (
      chapter_2,
      'text',
      'Pere Borrut',
      'card:Obispo',
      93
    );

  ELSE
    RAISE NOTICE 'El capítulo ya existe: %', chapter_2;
  END IF;
END $$;

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT
  id,
  title,
  subtitle,
  order_index,
  status
FROM history_chapters
ORDER BY order_index;

SELECT
  chapter_id,
  type,
  caption,
  order_index
FROM history_blocks
ORDER BY chapter_id, order_index;

COMMIT;
