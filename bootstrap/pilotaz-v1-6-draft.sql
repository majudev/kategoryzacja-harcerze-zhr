START TRANSACTION;

INSERT INTO CategorizationYear(
	`name`,
	`lesnaLesneThreshold`,
	`lesnaPuszczanskieThreshold`,
	`puszczanskaLesnaThreshold`,
	`puszczanskaPuszczanskieThreshold`,
	`state`
) VALUES (
	'Pilotaż v1.6',
	'11',
	'5',
	'3',
	'15',
	'DRAFT'
);

SET @categorizationYearId = LAST_INSERT_ID();

INSERT INTO InitialTask(
	`name`,
	`categorizationYearId`,
	`displayPriority`
) VALUES
	('12 członków w wieku harcerskim', @categorizationYearId, '80'),
	('Drużyna posiada 2 zastępy', @categorizationYearId, '82'),
	('Minimum 50% drużyny posiada kompletne umundurowanie', @categorizationYearId, '83'),
	('Drużyna posiada swój numer i barwy', @categorizationYearId, '84'),
	('Drużyna skorzystała z systemu stopni i sprawności', @categorizationYearId, '85'),
	('Drużynowy jest instruktorem ZHR lub drużyna posiada opiekuna wywiązującego się z obowiązków wynikających z regulaminu drużyn harcerzy', @categorizationYearId, '86'),
	('Drużyna posiada pisemne zgody każdego harcerza na przynależność do ZHR i formularze RODO', @categorizationYearId, '87'),
	('Drużyna posiada dokumentację finansową i inwentaryzacyjną', @categorizationYearId, '88'),
	('Drużyna zatwierdziła śródroczny Plan Pracy u hufcowego', @categorizationYearId, '89');
	
INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`,
	`displayPriority`
) VALUES (
	'STAN',
	@categorizationYearId,
	'40',
	'50',
	'50'
);

SET @stanId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Umundurowanie',
	@categorizationYearId,
	'60',
	'95'
);

SET @umundurowanieId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Obrzędowość i zwyczaje',
	@categorizationYearId,
	'50',
	'65'
);

SET @obrzedowoscId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Biwaki',
	@categorizationYearId,
	'50',
	'70'
);

SET @biwakiId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Wyjazd zimowy',
	@categorizationYearId,
	'35',
	'55'
);

SET @azId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Kwatermistrzostwo',
	@categorizationYearId,
	'60',
	'80'
);

SET @kwatermistrzostwoId = LAST_INSERT_ID();
	
INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Rozwój kadry',
	@categorizationYearId,
	'40',
	'60'
);

SET @rozwojkadryId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Stopnie',
	@categorizationYearId,
	'80',
	'120'
);

SET @stopnieId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Sprawności',
	@categorizationYearId,
	'70',
	'110'
);

SET @sprawnosciId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Zastępy',
	@categorizationYearId,
	'120',
	'160'
);

SET @zastepyId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Zastęp Zastępowych',
	@categorizationYearId,
	'80',
	'100'
);

SET @zzId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Służba',
	@categorizationYearId,
	'30',
	'45'
);

SET @sluzbaId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'KPH',
	@categorizationYearId,
	'35',
	'60'
);

SET @kphId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Zuchy i wędrownicy',
	@categorizationYearId,
	'35',
	'50'
);

SET @zwId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Praca z patronem',
	@categorizationYearId,
	'40',
	'60'
);

SET @patronId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Praca w hufcu',
	@categorizationYearId,
	'25',
	'40'
);

SET @hufiecId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Rozwój religijny',
	@categorizationYearId,
	'45',
	'60'
);

SET @religijnyId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Działalność w internecie',
	@categorizationYearId,
	'8',
	'13'
);

SET @internetId = LAST_INSERT_ID();

INSERT INTO CategorizationTaskGroup(
	`name`,
	`categorizationYearId`,
	`lesnaThreshold`,
	`puszczanskaThreshold`
) VALUES (
	'Plan pracy',
	@categorizationYearId,
	'45',
	'55'
);

SET @ppId = LAST_INSERT_ID();

INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób liczy drużyna?', 'REFONLY', '0', NULL, '1', @stanId, NULL, 1.0, 'Liczba osób w drużynie odpowiada liczbie zebranych zgód na przynależność do ZHR. Dotyczy wszystkich członków drużyny (zastępy+przyboczni+wędrownicy w drużynie*+drużynowy)*wliczamy osoby w wieku wędrowniczym, chociaż zaznaczamy, że nie jest to rozwiązanie optymalne', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób w wieku harcerskim liczy drużyna?', 'LINEAR', '40', 1, '1', @stanId, NULL, 1.0, 'Liczba osób w drużynie odpowiada liczbie zebranych zgód na przynależność do ZHR. Liczą się członkowie zastępów w wieku harcerskim (11-16 lat włącznie)', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów liczy drużyna?', 'REFONLY', '0', NULL, '1', @stanId, NULL, 1.0, 'Zastępy powinny być złożone z osób w wieku harcerskim. Za to zadanie nie otrzymasz punktów (patrz poniżej)', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów ma pomiędzy 5 a 8 członków?', 'LINEAR', '30', 5, '1', @stanId, NULL, 1.0, 'Liczą się tylko członkowie w wieku harcerskim.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu przybocznych jest w drużynie?', 'REFONLY', '0', NULL, '1', @stanId, NULL, 1.0, 'Ilość przybocznych w drużynie nie jest punktowana, służy jako baza do obliczania punktów z innych zadań', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób przyszło spoza ZHR?', 'LINEAR', '40', 1, '1', @stanId, NULL, 1.0, 'Dotyczy danego roku harcerskiego.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób przyszło z ZHR (np. z gromady)', 'LINEAR', '20', 0.5, '1', @stanId, NULL, 1.0, 'Dotyczy danego roku harcerskiego.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób wyszło do ZHR? (np do drużyny wędr.)', 'LINEAR', '20', 0.5, '1', @stanId, NULL, 1.0, 'Dotyczy danego roku harcerskiego.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób odeszło z ZHR?', 'REFONLY', '0', NULL, '1', @stanId, NULL, 1.0, 'Dotyczy danego roku harcerskiego. To zadanie nie jest punktowane i służy jedynie celom statystycznym.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada plakietkę drużyny', 'BOOLEAN', '10', NULL, '0', @umundurowanieId, NULL, 1.0, 'Indywidualna plakietka drużyny', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada plakietkę miejscowości/hufca/szczepu', 'BOOLEAN', '5', NULL, '0', @umundurowanieId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna ma proporzec / sztandar?', 'BOOLEAN', '10', NULL, '0', @obrzedowoscId, NULL, 1.0, 'Proporzec ma swoje miejsce w działaniach drużyny - jest zabierany na wydarzenia drużyny, wiążę się z obrzędami itp.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna praktykuje obrzęd związany z patronem drużyny.', 'BOOLEAN', '10', NULL, '0', @obrzedowoscId, @patronId, 0.5, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada obrzędowy element umundurowania ', 'BOOLEAN', '10', NULL, '0', @obrzedowoscId, @umundurowanieId, 0.5, 'np. suwak, laska skautowa, przypinka, nakrycie głowy', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada obrzęd nadania munduru.', 'BOOLEAN', '3', NULL, '0', @obrzedowoscId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada obrzęd nadania stopnia młodzika (przyrzeczenie)', 'BOOLEAN', '4', NULL, '0', @obrzedowoscId, @stopnieId, 0.75, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada obrzęd nadania stopnia wywiadowcy', 'BOOLEAN', '3', NULL, '0', @obrzedowoscId, @stopnieId, 0.75, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada obrzęd nadania stopnia ćwika', 'BOOLEAN', '3', NULL, '0', @obrzedowoscId, @stopnieId, 0.75, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada obrzęd przyjęcia harcerza do drużyny.', 'BOOLEAN', '3', NULL, '0', @obrzedowoscId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Na ilu wyjazdach była drużyna? (nie licząc obozu i zimowiska)', 'LINEAR', '50', 5, '0', @biwakiId, NULL, 1.0, 'Liczą się akcje poza miejscowością działania i trwające przynajmniej 24h.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile biwaków odbyło się na łonie natury? ', 'LINEAR', '0', 10, '0', @biwakiId, NULL, 1.0, '(pod namiotami, szłasami etc)', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna miała przynajmniej jeden biwak dalej niż 100km od miejsca działania', 'BOOLEAN', '10', NULL, '0', @biwakiId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna przesłała hufcowemu plan pracy biwaku w terminie przewidzianym przez hufcowego i plan został zatwierdzony', 'BOOLEAN', '5', NULL, '0', @biwakiId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zastępy same przygotowują sobie posiłki podczas biwaków', 'BOOLEAN', '10', NULL, '0', @biwakiId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna była na biwaku samodzielnym', 'BOOLEAN', '10', NULL, '0', @biwakiId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile dni trwało zimowisko drużyny?', 'LINEAR', '40', '3', '0', @azId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna była na zimowisku w chacie* ', 'BOOLEAN', '15', NULL, '0', @azId, NULL, 1.0, '*(miejscu, gdzie musi sama o wszystko zadbać / nie ma dodatkowej obsługi)', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna przeprowadziła min. jedno min. 3h wyjście na narty/snowboard', 'BOOLEAN', '10', NULL, '0', @azId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna przeprowadziła min. jedną min. 3h wędrówkę zimową bez sprzętu specjalistycznego', 'BOOLEAN', '10', NULL, '0', @azId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna przeprowadziła min. jedną min. 3h wędrówkę zimową ze sprzętem specjalistycznym', 'BOOLEAN', '10', NULL, '0', @azId, NULL, 1.0, ' (np raki, czekany, ski-tury)', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna w terminie zatwierdziła plan pracy zimowiska.', 'BOOLEAN', '20', NULL, '0', @azId, @kwatermistrzostwoId, 0.5, 'Termin jest ustalany przez przełożonych.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna w terminie ""rozliczyła się"" ze swoich dokumentów niezbędnych do zatwierdzenia zimowiska.', 'BOOLEAN', '10', NULL, '0', @azId, @kwatermistrzostwoId, 0.5, 'Termin jest ustalany przez przełożonych.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile rajdów/biwaków drużyny (>6h) odbyło się w okresie zimowym (grudzień-luty)?', 'LINEAR', '30', 5, '0', @azId, NULL, 1.0, 'Liczą się wyjazdy powyżej 24h oraz jednodniowe akcje w terenie (min. 6 h)', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna podjęła podczas ferii zimowych inne działania (np. rajd, cykl zbiórek)', 'BOOLEAN', '10', NULL, '0', @azId, NULL, 1.0, 'Zadanie przeznaczone dla drużyn, które nie mogły wziąć udziału w zimowisku', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna terminowo rozliczyła śródrocze.', 'BOOLEAN', '20', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, 'Termin jest ustalany przez przełożonych.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada i korzysta ze sprzętu 1', 'BOOLEAN', '3', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, 'Sprzęt specjalistyczny np. krótkofalarski.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada i korzysta ze sprzętu 2', 'BOOLEAN', '3', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, 'Sprzęt specjalistyczny np. krótkofalarski.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada sprzęt pionierski, który wystarcza do postawienia samodzielnego podobozu', 'BOOLEAN', '5', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada sprzęt, który wystarcza do zorganizowania samodzielnego obozu', 'BOOLEAN', '10', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Druzyna dba o swój sprzęt i regularnie go konserwuje.', 'BOOLEAN', '10', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zastępy mają swój wydzielony sprzęt za który odpowiadają.', 'BOOLEAN', '30', NULL, '0', @kwatermistrzostwoId, @zastepyId, 0.5, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada bilblioteczkę drużyny składającą się z min. 10 pozycji.', 'BOOLEAN', '3', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna prowadzi archiwum rozkazów', 'BOOLEAN', '3', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna przeprowadziła akcję zarobkową, zarobki z tej akcji przeznaczą na jakiś cel (np. zakup sprzętu lub obóz) (kwota zebrana)', 'BOOLEAN', '10', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, 'Akcja powinna zostać odpowiednio zgłoszona i zatwierdzona oraz rozliczona.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W ramach próby na stopień, harcerze zarabiają na część obozu', 'BOOLEAN', '12', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, 'Lub na inny wyznaczony cel - zadanie musi być stałym elementem próby na jeden ze stopni', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerze mają czynny udział w opłacaniu składek członkowskich', 'BOOLEAN', '5', NULL, '0', @kwatermistrzostwoId, NULL, 1.0, 'Np. Dostarczają składki, wykonują przelew - mają kontakt z pieniędzmi.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Członkowie kadry są zaangażowani w proces rozliczenia śródrocznego', 'BOOLEAN', '10', NULL, '0', @kwatermistrzostwoId, @rozwojkadryId, 0.5, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu przybocznych zdobywa stopień instruktorski?', 'LINEAR', '5', 5, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu przybocznych posiada stopień instruktorski?', 'LINEAR', '10', 10, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy zdobywa stopień podharcmistrza', 'BOOLEAN', '5', NULL, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy posiada stopień podharcmistrza', 'BOOLEAN', '10', NULL, '0', @rozwojkadryId, NULL, 1.0, 'lub harcmistrza.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy pracuje z następcą', 'BOOLEAN', '10', NULL, '0', @rozwojkadryId, NULL, 1.0, 'Praca z następcą to szeroki termin, pod którym należy rozumieć przede wszystkim wyznaczenie zadań (np. w próbach na stopień instruktorski), mających na celu przygotowanie następcy do funkcji drużynowego. ', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Przyboczni w drużynie są odpowiedzialni za konkretne obszary jej działania', 'BOOLEAN', '5', NULL, '0', @rozwojkadryId, NULL, 1.0, 'Np. kwatermistrzostwo, wsparcie w realizacji programu, prowadzenie strony internetowej itd.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Wszyscy przyboczni mieli wkład w tworzeniu planu pracy', 'BOOLEAN', '5', NULL, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Odbył się biwak kadry', 'BOOLEAN', '10', NULL, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zostało zorganizowane wydarzenie tylko dla kadry np. integracja', 'BOOLEAN', '5', NULL, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Członek kadry drużyny brał udział w zbiórce drużyny wyższej kategorii', 'BOOLEAN', '3', NULL, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Członek kadry drużyny pojechał na wyjazd drużyny wyższej kategorii', 'BOOLEAN', '5', NULL, '0', @rozwojkadryId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu przybocznych aktywnie realizuje próby na stopnie HO/HR', 'LINEAR', '3', 3, '0', @rozwojkadryId, NULL, 1.0, 'Próba nie powinna się ""rozwlekać"". To że przyboczny 4 lata temu otworzył próbę na HO nie oznacza że ją realizuje.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada krąg/kręgi stopni', 'BOOLEAN', '5', NULL, '1', @stopnieId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada oznaczenia stopnia inne niż na krzyżu ', 'BOOLEAN', '5', NULL, '1', @stopnieId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W drużynie próby na stopień młodzika wieńczone są biegiem na stopień.', 'BOOLEAN', '5', NULL, '1', @stopnieId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W drużynie próby na stopień wywiadowcy wieńczone są biegiem na stopień.', 'BOOLEAN', '5', NULL, '1', @stopnieId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W drużynie próby na stopień ćwika wieńczone są biegiem na stopień.', 'BOOLEAN', '5', NULL, '1', @stopnieId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W drużynie przeprowadzane są formy w których stopnie mają istotne znaczenie (np. gra młodzik 1 życie wyw 2 a ćwik 3 a trudność zadań jest dostosowana do poziomu harcerzy)', 'BOOLEAN', '5', NULL, '1', @stopnieId, NULL, 1.0, 'Zachodzi gratyfikacja za posiadanie wyższego stopnia. Bardzo ważne jest jednoczesne dostosowanie poziomu trudności powierzanego zadania.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób zdobyło 0-1 sprawności?', 'REFONLY', '0', NULL, '0', @sprawnosciId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób zdobyło 2-4 sprawności?', 'LINEAR', '1', 1, '0', @sprawnosciId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób zdobyło 5-7 sprawności?', 'LINEAR', '3', 3, '0', @sprawnosciId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób zdobyło 8-9 sprawności?', 'LINEAR', '5', 5, '0', @sprawnosciId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób zdobyło 10+ sprawności?', 'LINEAR', '7', 7, '0', @sprawnosciId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada sprawność drużyny/patrona.', 'BOOLEAN', '10', NULL, '0', @sprawnosciId, @patronId, 0.5, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna przeprowadziła formę pracy opartą o zdobywanie sprawności', 'BOOLEAN', '10', NULL, '0', @sprawnosciId, NULL, 1.0, 'Np. Zbiórka drużyny.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W drużynie zdobyte sprawności przekładają się na uprawnienia do konkretnych działań (np. ułożenie ogniska, obsługa łączności, odpowiedzialność za kuchnię itp.)', 'BOOLEAN', '3', NULL, '0', @sprawnosciId, NULL, 1.0, 'Np. aby zostać tomografem zastępu, harcerz musi posiadać sprawność ** Terenoznawca.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W drużynie premiowane są osoby aktywnie zdobywające dużą ilość sprawności', 'BOOLEAN', '3', NULL, '0', @sprawnosciId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Członkowie drużyny wprowadzili nową sprawność w drużynie', 'BOOLEAN', '5', NULL, '0', @sprawnosciId, NULL, 1.0, 'Chodzi o inicjatywę harcerzy. Oczywiście mądry drużynowy, podsunie im ten pomysł i pokaże jak poprawnie taką sprawność ułożyć.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów odbywa regularne zbiórki raz w tygodniu?', 'LINEAR', '20', 20, '0', @zastepyId, NULL, 1.0, 'Regularny - Za SJP.: odbywający się, powtarzający w jednakowych odstępach czasu; miarowy, jednostajny, systematyczny.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów odbywa regularne zbiórki min. 2 razy w miesiącu?', 'LINEAR', '10', 10, '0', @zastepyId, NULL, 1.0, 'Regularny - Za SJP.: odbywający się, powtarzający w jednakowych odstępach czasu; miarowy, jednostajny, systematyczny.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów odbywa regularne zbiórki min. raz w miesiącu?', 'LINEAR', '5', 5, '0', @zastepyId, NULL, 1.0, 'Regularny - Za SJP.: odbywający się, powtarzający w jednakowych odstępach czasu; miarowy, jednostajny, systematyczny.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Słabsze zastępy są wspierane przez ""opiekuna"" wyznaczonego przez drużynowego, np. byłych zastępowych', 'BOOLEAN', '5', NULL, '0', @zastepyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W drużynie w ciągu roku odbył się min. 1 biwak samodzielnie zorganizowany przez zastęp', 'BOOLEAN', '10', NULL, '0', @zastepyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Conajmniej połowa zbiórek zastępów odbywa się w lesie/parku (na zewnątrz)', 'BOOLEAN', '15', NULL, '0', @zastepyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Na zbiórkach realizowane są sprawności/stopnie, tj. program zbiórki wypełnia zadania na stopień/sprawność', 'BOOLEAN', '5', NULL, '0', @zastepyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zastępy w naturalny sposób pozyskują nowych członków (tj. poza zorganizowanym naborem)', 'BOOLEAN', '10', NULL, '0', @zastepyId, @zwId, 0.5, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W zastępach występuje podział zadań', 'BOOLEAN', '3', NULL, '0', @zastepyId, NULL, 1.0, 'Np. działają funkcyjni.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zastępy prowadzą własną kronikę', 'BOOLEAN', '3', NULL, '0', @zastepyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zastępy terminowo wywiązują się ze swoich zobowiązań', 'BOOLEAN', '3', NULL, '0', @zastepyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zastępy przeprowadzają własne akcje zarobkowe', 'BOOLEAN', '6', NULL, '0', @zastepyId, @kwatermistrzostwoId, 0.5, 'Akcja powinna zostać odpowiednio zgłoszona i zatwierdzona oraz rozliczona.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('ZZ posiada ukształtowaną, odrębną od obrzędowości drużyny i żywą obrzędowość - np. obrzęd przyjęcia, element umundurowania, zwyczaje, inne.', 'BOOLEAN', '15', NULL, '0', @zzId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy prowadzi z zastępowymi regularną (min. 3 razy w ciągu roku) pracę w formie doradczej (np. rada drużyny)', 'BOOLEAN', '10', NULL, '0', @zzId, NULL, 1.0, 'Regularny - Za SJP.: odbywający się, powtarzający w jednakowych odstępach czasu; miarowy, jednostajny, systematyczny.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy prowadzi z zastępowymi regularną (min. 3 razy w ciągu roku) pracę w formie inspirującej (np. zbiórki pokazowe)', 'BOOLEAN', '20', NULL, '0', @zzId, NULL, 1.0, 'Regularny - Za SJP.: odbywający się, powtarzający w jednakowych odstępach czasu; miarowy, jednostajny, systematyczny.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy prowadzi z zastępowymi pracę w formie integracyjnej (np. wyjścia ZZtu)', 'BOOLEAN', '10', NULL, '0', @zzId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Na zbiórkach ZZtu realizowane są sprawności/stopnie, tj. program zbiórki wypełnia zadania na stopień/sprawność', 'BOOLEAN', '15', NULL, '0', @zzId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Częstotliwość spotykania się ZZ-tu (wpisać liczbę akcji na rok)', 'LINEAR', '80', 2, '0', @zzId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('ZZ pracuje zgodnie z własnym planem pracy ', 'BOOLEAN', '5', NULL, '0', @zzId, NULL, 1.0, 'Zatwierdzonym uprzednio przez hufcowego.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('ZZ/Rada drużyny bierze udział w podejmowaniu decyzji związanych z drużyną', 'BOOLEAN', '5', NULL, '0', @zzId, NULL, 1.0, 'Np. decyzje odnośnie ilości biwaków, wyjazdu na obóz samodzielny, programu akcji itd. przy jednoczesnym wsparciu drużynowego.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób wzięło udział w kursie specjalistycznym (HOPR, krótkofalarski, inne)', 'LINEAR', '18', 3, '0', @zzId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna wzięła udział w przynajmniej jednym lokalnym wydarzeniu (np. impreza osiedlowa).', 'BOOLEAN', '5', NULL, '0', @sluzbaId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna współorganizowała przynajmniej jedno lokalne wydarzenie (np. imprezę osiedlową)', 'BOOLEAN', '10', NULL, '0', @sluzbaId, NULL, 1.0, 'Należy tu rozumieć przede wszystkim wsparcie merytoryczne i organizacyjne np. podczas współorganizując grę miejską.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów w ciągu roku samodzielnie podjęło się służby?', 'LINEAR', '15', 3, '0', @sluzbaId, NULL, 1.0, 'Ile zastępów chociaż raz w roku podjęło się służby na rzecz potrzebujących (w ramach akcji zastępu) Jeżeli zastęp ma stałe pole służby, nie należy uwzględniać go w tym zadaniu', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile akcji (służb) na rzecz potrzebujących podjęła drużyna w trakcie roku?', 'LINEAR', '20', 4, '0', @sluzbaId, NULL, 1.0, 'Liczą się akcje podjęte całą drużyną, na rzecz osób potrzebujących ', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna stale współpracuje ze szkołą lub lokalną instytucją.', 'BOOLEAN', '10', NULL, '0', @sluzbaId, NULL, 1.0, 'Należy tu rozumieć współpracę, w ramach której obie strony mogą osiągać korzyści np. szkoła umożliwia przeprowadzanie naborów i dostęp do części pomieszczeń a drużyna wspiera szkołę przy organizacji rajdu szkolnego.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów ma stałe pole służby (np. pomoc w zakupach osobie starszej)?', 'LINEAR', '30', 10, '0', @sluzbaId, NULL, 1.0, 'Stałe pole służby to takie, które wymaga regularnego i ciągłego zaangażowania wszystkich członków zastępu np. wykonywanie zakupów dla starszych osób lub dostarczanie im posiłków. Warto pamiętać o placówkach instytucjonalnych, które koordynują podobne działania.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna współorganizowała akcję charytatywną na rzecz osób potrzebujących (np. organizacja charytatywnego turnieju piłkarskiego).', 'BOOLEAN', '15', NULL, '0', @sluzbaId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy przeprowadził w ciągu roku min. jedno spotkanie z rodzicami.', 'BOOLEAN', '10', NULL, '0', @kphId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy utrzymuje stały kontakt z rodzicami harcerzy (mailowy lub telefoniczny).', 'BOOLEAN', '5', NULL, '0', @kphId, NULL, 1.0, 'Drużynowy na bieżąco informuje rodziców o działaniach drużyny (min. raz na 3 miesiące)', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy rozmawia o sytuacji wychowawczej swoich podopiecznych z ich rodzicami.', 'BOOLEAN', '10', NULL, '0', @kphId, NULL, 1.0, 'Inicjatywa do przeprowadzenia tego typu rozmowy powinna być przede wszystkim po stronie drużynowego. Należy unikać ""szkolnego"" stylu prowadzenia tego typu rozmów.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna zorganizowała ognisko/spotkanie integracyjne dla rodzin harcerzy', 'BOOLEAN', '10', NULL, '0', @kphId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Kadra drużyny bierze udział w organizacji i prowadzeniu spotkań z rodzicami', 'BOOLEAN', '9', NULL, '0', @kphId, @rozwojkadryId, 0.67, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy odwiedza rodziny harcerzy w ich domach.', 'BOOLEAN', '20', NULL, '0', @kphId, NULL, 1.0, 'W sposób naturalny i kulturalny np. rada ZZ-tu odbywa się w domu zastępowego, drużynowy przychodzi na obiad do harcerza zdobywającego sprawność ""Kuchmistrza"". Odbyły się minimum 3 takie spotkania.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna zorganizowała wydarzenie/grę wymagającą współpracy rodziców z harcerzami.', 'BOOLEAN', '20', NULL, '0', @kphId, NULL, 1.0, 'Np. bieg na orientację lub spływ kajakowy ojców z synami', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna utrzymuje kontakt z byłymi członkami drużyny / KPH i w ciągu roku zaprosiła ich do udziału w formie pracy z drużyną (ognisko, rajd, biwak).', 'BOOLEAN', '10', NULL, '0', @kphId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Przy drużynie funkcjonuje KPH i w ciągu roku przeprowadziło min. jedno działanie na rzecz drużyny', 'BOOLEAN', '15', NULL, '0', @kphId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna wsparła w działaniu gromadę zuchów (jednorazowo np. przy okazji biwaku)', 'BOOLEAN', '5', NULL, '0', @zwId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna zorganizowała i przeprowadziła nabór w ciągu roku.', 'BOOLEAN', '10', NULL, '0', @zwId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Członkowie drużyny w wieku wędrowniczym posiadają lub zdobywają naramiennik wędrowniczy', 'BOOLEAN', '10', NULL, '0', @zwId, @rozwojkadryId, 0.5, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna współorganizuje kolonie zuchową (np. kadra drużyny była obecna na części kolonii).', 'BOOLEAN', '10', NULL, '0', @zwId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Przy drużynie działa drużyna/patrol wędrowniczy.', 'BOOLEAN', '10', NULL, '0', @zwId, NULL, 1.0, 'Działania takiego patrolu powinny być koordynowane przez instruktora i nie powinny być docelową formą działalności metodyką wędrowniczą. Tego typu rozwiązanie dopuszcza się jeśli przy drużynie nie działa drużyna wędrowników.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Przy drużynie działa gromada/patrol zuchowy', 'BOOLEAN', '10', NULL, '0', @zwId, NULL, 1.0, 'Działania takiego patrolu powinny być koordynowane przez instruktora i nie powinny być docelową formą działalności metodyką zuchową. Tego typu rozwiązanie dopuszcza się jeśli przy drużynie nie działa gromada zuchów.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna regularnie wspiera w działaniu gromadę zuchów (np. członkowie kadry są obecni na zbiórkach gromady)', 'BOOLEAN', '10', NULL, '0', @zwId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna przekazuje harcerzy do drużyny wędrowników.', 'BOOLEAN', '5', NULL, '0', @zwId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna wykonała krok w celu założenia nowej gromady zuchów, np. członek kadry drużyny ukończył kurs metodyki zuchowej', 'BOOLEAN', '15', NULL, '0', @zwId, @rozwojkadryId, 0.67, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerz poznaje bohatera. Drużyna wytypowała bohatera, zorganizowała akcję wewnątrz drużyny na jego temat (np. gra o historii bohatera, ognisko tematyczne).', 'BOOLEAN', '5', NULL, '0', @patronId, NULL, 1.0, 'Należy skupić się na przedstawieniu harcerzom w drużynie historii i sylwetki bohatera. Działania dotyczą zbiorowych form pracy.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerz poznaje bohatera. Harcerze poznają postać bohatera, wpisane w próbie na chustę lub próbę na stopień młodzika', 'BOOLEAN', '5', NULL, '0', @patronId, NULL, 1.0, 'Należy skupić się na przedstawieniu harcerzom w drużynie historii i sylwetki bohatera. Jego postać jest na stałe wpisana w działania drużyny. Działania dotyczą indywidualnych form pracy.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerz zna bohatera. Drużyna wytypowała bohatera, zorganizowała akcję w środowisku harcerskim na jego temat (np. oprowadzanie po muzeum, spotkanie ze świadkami wydarzeń).', 'BOOLEAN', '10', NULL, '0', @patronId, NULL, 1.0, 'Należy skupić się na przedstawieniu harcerzom poza drużynom np. w hufcu, szczepie, historii i sylwetki bohatera. Działania dotyczą zbiorowych form pracy.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerz zna bohatera. Praca z bohaterem jest wpisana w próby na stopnie (np. próba charakteru).', 'BOOLEAN', '10', NULL, '0', @patronId, NULL, 1.0, 'Harcerze znają już postać bohatera i starają się go naśladować w codziennym życiu. Działania dotyczą indywidualnych form pracy.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerz przekazuje wiedzę o bohaterze. Drużyna wytypowała bohatera, zorganizowała akcję w środowisku lokalnym na jego temat (np. grę przybliżającą jego postać).', 'BOOLEAN', '20', NULL, '0', @patronId, NULL, 1.0, 'Należy skupić się na przedstawieniu osobom spoza harcerstwa np. mieszkańcom miejscowości, historii i sylwetki bohatera. Działania dotyczą zbiorowych form pracy.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerz przekazuje wiedzę o bohaterze. Harcerze podejmują indywidualne działania mające na celu promowanie postaci bohatera.', 'BOOLEAN', '20', NULL, '0', @patronId, NULL, 1.0, 'Należy skupić się na przedstawieniu osobom spoza harcerstwa np. mieszkańcom miejscowości, historii i sylwetki bohatera. Działania dotyczą indywidualnych form pracy. Przykład indywidualnych działań to  np. piosenka o patronie, wystawa fotograficzna, zdobycie sprawności w oparciu o działanie z patronem.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada patrona', 'BOOLEAN', '10', NULL, '0', @patronId, NULL, 1.0, 'Posiadanie patrona powinno być zwieńczeniem pracy wykonywanej w ramach pozostałych zadań z tego obszaru.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna podjęła wspólne działanie z inną drużyną harcerzy (np. służba, wspólna zbiórka zastępów)', 'BOOLEAN', '5', NULL, '0', @hufiecId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W ilu akcjach drużyna wzięła udział w wydarzeniach hufcu, chorągwi, szczepu', 'LINEAR', '15', 3, '0', @hufiecId, NULL, 1.0, 'W odniesieniu do akcji dedykowanych dla drużyn harcerskich', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna współorganizuje wydarzenie na poziomie hufca/chorągwi/szczepu', 'BOOLEAN', '15', NULL, '0', @hufiecId, NULL, 1.0, 'Np. Drużyna puszczańska współorganizuje TDL.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Kadra drużyny współorganizuje jedno z wydarzeń hufca/chorągwi/szczepu', 'BOOLEAN', '20', NULL, '0', @hufiecId, @rozwojkadryId, 0.5, 'Np. Kurs zastępowych.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna wywiązuje się z obowiązków względem hufca (obecność na radzie hufca itp.)', 'BOOLEAN', '5', NULL, '0', @hufiecId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna zabrała na zbiórkę członka kadry drużyny niższej kategorii', 'BOOLEAN', '3', NULL, '0', @hufiecId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna zabrała na wyjazd członka kadry drużyny niższej kategorii', 'BOOLEAN', '5', NULL, '0', @hufiecId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Przeprowadzenie spotkania drużyny z duszpasterzem', 'BOOLEAN', '15', NULL, '0', @religijnyId, NULL, 1.0, 'Spotkanie w dowolnej formie - luźne spotkanie, wspólny wyjazd na biwak, rozmowa na konkretny temat.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile akcji w ramach służby na rzecz parafii podjęła drużyna w ciągu roku harcerskiego?', 'LINEAR', '30', 3, '0', @religijnyId, @sluzbaId, 0.5, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Harcerze realizują rozwój religijny w ramach próby na stopień', 'BOOLEAN', '15', NULL, '0', @religijnyId, NULL, 1.0, 'Przez konkretne zadanie np. rozmowa na temat wiary z wybranym autorytetem, odnalezienie odpowiedzi na nurtujące pytanie w dokumentach kościoła np. KKK.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zorganizowanie rekolekcji/dzień skupienia dla ZZ/kadry', 'BOOLEAN', '10', NULL, '0', @religijnyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zorganizowanie rekolekcji/dzień skupienia dla całej drużyny.', 'BOOLEAN', '15', NULL, '0', @religijnyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Kapelan drużyny wspólnie z drużynowym określa cele związane z rozwojem duchowym i planuje określone działania w ciągu roku ', 'BOOLEAN', '25', NULL, '0', @religijnyId, NULL, 1.0, 'Kapelan drużyny to kapłan który regularnie współpracuje z drużyną, zna harcerzy, orientuje się w specyfice metody harcerskiej i jest realnym wsparciem w prowadzeniu wychowania religijnego.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna zorganizowała w parafii nabożeństwo (np. harcerska droga krzyżowa)', 'BOOLEAN', '15', NULL, '0', @religijnyId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada swój fanpage w social mediach (facebook, instagram) na którym pojawiła się aktywność w ciągu ostatniego roku', 'BOOLEAN', '3', NULL, '0', @internetId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna regularnie (min. raz w miesiącu) publikuje na swoim fanpage-u', 'BOOLEAN', '5', NULL, '0', @internetId, NULL, 1.0, 'Publikacja powinna mieć coś wspólnego z działalnością drużyny.', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada stronę internetową na której można znaleźć podstawowę informacje o drużynie (historia, opis, miejsce funkcjonowania, dane kontaktowe)', 'BOOLEAN', '5', NULL, '0', @internetId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada stronę internetową, gdzie publikuje aktualności związane z życiem drużyny', 'BOOLEAN', '10', NULL, '0', @internetId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużyna posiada internetowy kanał komunikacji wewnętrznej (messenger, discord)', 'BOOLEAN', '3', NULL, '0', @internetId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Odbyło się działanie (gra, warsztaty, film) promujące rozsądek i bezpieczeństwo podczas korzystania z internetu', 'BOOLEAN', '5', NULL, '0', @internetId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Zdrowe korzystanie z technologii jest elementem prób na stopnie ', 'BOOLEAN', '8', NULL, '0', @internetId, @stopnieId, 0.75, 'Przynajmniej na jeden ze stopni - np. zadanie związane z pilnowaniem czasu spędzanego przed ekranem', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Umiejętności cyfrowe są elementami prób na stopnie ', 'BOOLEAN', '4', NULL, '0', @internetId, @stopnieId, 0.75, 'np. wysyłanie maili, tworzenie dokumentów lub arkuszy kalkulacyjnych, programowanie', NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Plan pracy został zatwierdzony w terminie', 'BOOLEAN', '5', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Plan pracy posiada charakterystyki czonków drużyny ', 'BOOLEAN', '5', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W planie pracy postawione cele, dla drużyny, ZZtu i kadry zgodnie z metodyką SMART', 'BOOLEAN', '5', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Stworzenie w planie pracy podsumowania zeszłego roku', 'BOOLEAN', '5', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy tworzy plan każdej akcji drużyny, uwzględniając w nim cele oraz formy pracy', 'BOOLEAN', '10', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy prowadzi ewidencję członków drużyny, zawierającą conajmniej dane osobowe i kontaktowe harcerzy', 'BOOLEAN', '5', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Drużynowy prowadzi książkę pracy, zawierającą dane osobowe i kontaktowe harcerzy, zdobyte przez nich sprawności oraz stopnie, obecność na akcjach, składki ', 'BOOLEAN', '10', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W planie pracy zawarta została analiza stopni członków drużyny (jaki posiada / jaki powinien posiadać w tym wieku / czy go zdobywa).', 'BOOLEAN', '10', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('W planie pracy zawarta została analiza arkusza kategoryzacyjnego w celu uwzględnienia brakujących zadań na celowaną kategorię.', 'BOOLEAN', '10', NULL, '0', @ppId, NULL, 1.0, NULL, NULL);

SELECT `id` INTO @refIleOsobId FROM CategorizationTask WHERE name = 'Ile osób liczy drużyna?' LIMIT 1;
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób posiada pełne umundurowanie?', 'PARABOLIC_REF', '50', NULL, '0', @umundurowanieId, NULL, 1.0, 'Zgodne z regulaminem: bluza mundurowa, spodnie długie i krótkie, pas, nakrycie głowy itd.', @refIleOsobId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób posiada T-shirty / umundurowanie polowe?', 'PARABOLIC_REF', '20', NULL, '0', @refIleOsobId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób posiada jednolite okrycie wierzchnie (bluzy / polary / kurtki)?', 'PARABOLIC_REF', '20', NULL, '0', @umundurowanieId, NULL, 1.0, NULL, @refIleOsobId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile osób posiada przyszytą plakietkę? ', 'LINEAR_REF', '20', NULL, '0', @umundurowanieId, @obrzedowoscId, 0.5, 'dowolną, ALE jednolicie w drużynie - może być kategoryzacyjna, hufca, drużyny, itp.', @refIleOsobId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu członków drużyny posiada stopień adekwatny do wieku?', 'LINEAR_REF', '100', NULL, '1', @stopnieId, NULL, 1.0, NULL, @refIleOsobId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu członków drużyny zdobywa stopień adekwatny do wieku?', 'LINEAR_REF', '50', NULL, '1', @stopnieId, NULL, 1.0, 'Liczą się również Ci, którzy posiadają i zdobywają stopień adekwatny', @refIleOsobId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu członków drużyny ma oznaczone zdobyte sprawności w widoczny sposób (laska skautowa, rękaw, inne)', 'PARABOLIC_REF', '30', NULL, '0', @sprawnosciId, @umundurowanieId, 0.33, NULL, @refIleOsobId);

SELECT `id` INTO @refIleZastepowId FROM CategorizationTask WHERE name = 'Ile zastępów liczy drużyna?' LIMIT 1;
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów posiada/zdobywa proporzec?', 'LINEAR_REF', '20', NULL, '0', @obrzedowoscId, NULL, 1.0, NULL, @refIleZastepowId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ile zastępów posiada min. 1 oddzielny obrzęd zastępu?', 'LINEAR_REF', '20', NULL, '0', @obrzedowoscId, @zastepyId, 0.75, NULL, @refIleZastepowId);
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu zastępowych ukończyło kurs zastępowych (w hufcu lub w drużynie) lub inną formę przeszkolenia?', 'LINEAR_REF', '20', NULL, '0', @zastepyId, NULL, 1.0, NULL, @refIleZastepowId));
INSERT INTO CategorizationTask(`name`, `type`, `maxPoints`, `multiplier`, `obligatory`, `primaryGroupId`, `secondaryGroupId`, `split`, `description`, `refValId`) VALUES ('Ilu zastępowych planują pracę zastępu w sposób regularny (tj. nie ""ze zbiórki na zbiórkę"")', 'LINEAR_REF', '20', NULL, '0', @zastepyId, NULL, 1.0, 'Np. W zeszycie pracy lub za pomocą innego narzędzia.', @refIleZastepowId);
	
COMMIT;
