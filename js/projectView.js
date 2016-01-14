(function(module) {
  var filters = {};
  Project.portfolioItems = [];

  function Project (project) {
    this.title = project.title;
    this.datePublished = project.datePublished;
    this.category = project.category;
    this.details = project.details;
    this.image = project.image;
    this.link = project.link;
  }

  Project.prototype.toHtml = function() {
    var templateScript = $('#project-template').html();
    var compiledTemplate = Handlebars.compile(templateScript);
    this.daysAgo = parseInt((new Date() - new Date(this.datePublished))/60/60/24/1000);
    this.publishStatus = this.datePublished ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    var html = compiledTemplate(this);
    $('#portfolio').append(html);
  };

  filters.populateFilter = function() {
    $('article').each(function() {
      var val = $(this).find('.cat').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      if ($('#category-filter option[value="' + val + '"]').length === 0) {
        $('#category-filter').append(optionTag);
      }
    });
  };

  filters.handleFilter = function() {
    $('#category-filter').on('change', function() {
      if ($(this).val()) {
        $('article').hide();
        $('article[data-category="' + $(this).val() + '"]').fadeIn();
      } else {
        $('article').fadeIn();
      }
    });
  };

  Project.initIndexPage = function() {
    Project.portfolioItems.forEach(function(a){
      $('#portfolio').append(a.toHtml());
    });
    filters.populateFilter();
    filters.handleFilter();
    stateChange.initToggling();
    Project.prototype.loadImages();
  };


  //new code added
  //this function will take lines 46 - 52 and add them to one functions
  Project.loadAll = function(data) {
    projectsList.sort(function(a,b) {
      return (new Date(b.datePublished)) - (new Date(a.datePublished));
    });

    projectsList.forEach(function(ele) {
      Project.portfolioItems.push(new Project(ele));
    });
  };

  //this will retrieve the data from the local source, process it and hand of control to the view
  Project.fetchAll = function() {
    if (localStorage.data) {
      Project.loadAll(JSON.parse(localStorage.data));
      Project.initIndexPage(); //need to figure out what to name this and why
    } else {
      $.getJSON('data/projects.json', function(data) {
        Project.loadAll(data);
        localStorage.data = JSON.stringify(data);
        Project.initIndexPage(); //need to figure out what to name this and why
      });
    }
  };
  //filter images out of objects into a new array using map
  Project.prototype.loadImages = function() {
    var arrayOfImages = Project.portfolioItems.map(function(obj) {
      return obj.image;
    });
    console.log(arrayOfImages);

    var stringifiedLinks = arrayOfImages.reduce(function(prev, current) {
      return prev + '<li>' + current + '</i>';
    }, '');
    console.log('<ul>' + stringifiedLinks + '</ul>');
    $('#image-nav').append('<ul>' + stringifiedLinks + '</ul>');
  };

  //reduce the new array into a string holding the image links

  module.Project = Project;
  module.filters = filters;
})(window);
