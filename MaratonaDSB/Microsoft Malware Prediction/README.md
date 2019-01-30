# Projetos Kaggle - House Prices

## Datasets
### Treino
#### Columns
    * PassengerId: type should be integers
    * Survived: Survived or Not
    * Pclass: Class of Travel
    * Name: Name of Passenger
    * Sex: Gender
    * Age
    * SibSp: Number of Sibling/Spouse aboard
    * Parch: Number of Parent/Child aboard
    * Ticket
    * Fare
    * Cabin
    * Embarked: The port in which a passenger has embarked. C - Cherbourg, S - Southampton, Q = Queenstown
### Teste
##### Columns
    * PassengerId
    * Pclass
    * Name
    * Sex
    * Age
    * SibSp
    * Parch
    * Ticket
    * Fare
    * Cabin
    * Embarked
### Conversões
#### Columns
    * Sex:      {'female': 0, 'male': 1}
    * Age:      {"Missing": 0, "Infant": 1, "Child": 2, "Teenager": 3, "Adult": 4, "Senior": 5}
    * Fare:     {"Inferior": 0, "Basic": 1, "Superior": 2, "Executive": 3}
    * Title:    {"Mr": 1, "Miss": 2, "Mrs": 3, "Master": 4, "Rare": 5}
    * Embarked: {'S': 0, 'C': 1, 'Q': 2}
    
### Envio
#### Columns
    * PassengerId: integer
    * Survived: binary
    
    ### Variable Notes
* survival
    * 0 = No
    * 1 = Yes
* pclass: A proxy for socio-economic status (SES)
    * 1: 1st = Upper
    * 2: 2nd = Middle
    * 3: 3rd = Lower
* age: Age is fractional if less than 1. If the age is estimated, is it in the form of xx.5
* sibsp: The dataset defines family relations in this way...
    * Sibling = brother, sister, stepbrother, stepsister
    * Spouse = husband, wife (mistresses and fiancés were ignored)
* parch: The dataset defines family relations in this way...
    * Parent = mother, father
    * Child = daughter, son, stepdaughter, stepson
    * Some children travelled only with a nanny, therefore parch=0 for them.
* embarked: 
    * C = Cherbourg
    * Q = Queenstown
    * S = Southampton 
