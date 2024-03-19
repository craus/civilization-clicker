function createAllResources() {
  resources = {
    time: variable(0, 'time', {formatter: Format.time}),
    idleTime: variable(0, 'idleTime'),
    money: variable(0, 'money'),
    population: variable(1, 'population'),
    science: variable(0, 'science'),
    totalTech: variable(0, 'totalTech'),
    tech: variable(0, 'tech'),
    minerals: variable(0, 'minerals'),
    farms: variable(0, 'farms'),
    mines: variable(0, 'mines'),
    marketplaces: variable(0, 'marketplaces'),
    labs: variable(0, 'labs'),
    scientists: variable(0, 'scientists'),
    cranes: variable(0, 'cranes'),
    cranesFarms: variable(0, 'cranesFarms'),
    cranesMines: variable(0, 'cranesMines'),
    cranesMarketplaces: variable(0, 'cranesMarketplaces'),
    cranesLabs: variable(0, 'cranesLabs'),
    cranesUniversities: variable(0, 'cranesUniversities'),
    cranesBarracks: variable(0, 'cranesBarracks'),
    cranesFactories: variable(0, 'cranesFactories'),
    cranesCircuses: variable(0, 'cranesCircuses'),
    tractors: variable(0, 'tractors'),
    excavators: variable(0, 'excavators'),
    cashMachines: variable(0, 'cashMachines'),
    panzers: variable(0, 'panzers'),
    soldiers: variable(0, 'soldiers'),
    warpower: variable(0, 'warpower'),
    conquests: variable(0, 'conquests'),
    conquestCost: variable(100, 'conquestCost'),
    planes: variable(0, 'planes'),
    swamps: variable(0, 'swamps'),
    mountains: variable(0, 'mountains'),
    forests: variable(0, 'forests'),
    islands: variable(0, 'islands'),
    happiness: variable(0, 'happiness'),
    circuses: variable(0, 'circuses'),
    universities: variable(0, 'universities'),
    barracks: variable(0, 'barracks'),
    factories: variable(0, 'factories'),
    factoriesCranes: variable(0, 'factoriesCranes'),
    factoriesTractors: variable(0, 'factoriesTractors'),
    factoriesExcavators: variable(0, 'factoriesExcavators'),
    factoriesCashMachines: variable(0, 'factoriesCashMachines'),
    factoriesPanzers: variable(0, 'factoriesPanzers'),
    commands: variable(3, 'commands', {formatter: x => x.toFixed(2)})
  }
  areas = {
    planes: resources.planes,
    swamps: resources.swamps,
    mountains: resources.mountains,
    forests: resources.forests,
    islands: resources.islands,
  }
  Object.values(areas).forEach(function(area) {
    $('.#{0}Conquest .conquest'.i(area.id)).click(() => {
      if (resources.conquests.value >= 1) {
        area.value += 1
        resources.conquests.value -= 1
      }
    })
  })
  
  techs = createAllTechs()


  resources.science.income = (() => 
    resources.scientists() *
    (1+resources.labs()) *
    (1+techs.scientistsGuild() * resources.happiness()) *
    (Math.pow(10, resources.islands()))
  ) 
  resources.money.income = (() => 
    resources.population() *
    (1+resources.marketplaces()) *
    (1+resources.happiness()) *
    (Math.pow(30, resources.forests()))
  )
  resources.minerals.income = (() => 
    techs.minerals() * 
    resources.population() *
    (1+resources.mines()) *
    (1+techs.minersGuild() * resources.happiness()) *
    (Math.pow(100, resources.mountains()))
  )  
  resources.happiness.income = (() => 
    resources.circuses()
  )
  resources.warpower.income = (() => 
    resources.soldiers() *
    (1+resources.panzers())
  )
  resources.population.income = (() => 
    resources.farms() *
    (1+resources.tractors()) *
    (Math.pow(10, resources.planes()))
  )
  resources.time.income = (() => 1)
  resources.idleTime.income = (() => 1)
  

  conquestPenalty = (() => 100)
  
  researchedTechsCount = () => Object.values(techs).filter(t => t.value == 1).length
}