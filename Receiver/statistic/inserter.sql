INSERT INTO MetricsTypes(Name, Description, MinValue, MaxValue)
VALUES ('1', '1', 0, 100);

DECLARE @Id INT = (SELECT SCOPE_IDENTITY());

insert into MetricsStates (MetricTypeId, StateId, MinValue, MaxValue)
values (@Id, 1, 0, 25),
(@Id, 2, 26, 50),
(@Id, 3, 51, 100);