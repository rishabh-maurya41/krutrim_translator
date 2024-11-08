document.addEventListener('DOMContentLoaded', function () {
    // Select all tab links
    const tabLinks = document.querySelectorAll('.tab-link');

    // Function to set active tab
    function setActiveTab(clickedTab) {
      // Remove active classes from all tabs
      tabLinks.forEach(link => {
        link.classList.remove('border-green-500','border-l', 'border-t', 'border-r', 'rounded-t', 'text-blue-700');
        link.classList.add('border-transparent','text-blue-500');
      });

      // Add active classes to clicked tab
      clickedTab.classList.remove('border-transparent','text-blue-500');
      clickedTab.classList.add('border-green-500','border-l', 'border-t', 'border-r', 'rounded-t', 'text-blue-700');
    }

    // Attach click event to each tab link
    tabLinks.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        // Get the target tab ID from the clicked link's data attribute
        const tabId = link.getAttribute('data-tab');

        // Hide all tabs
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
          tab.classList.add('hidden');
        });

        // Show the selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
          selectedTab.classList.remove('hidden');
        }

        // Set active tab
        setActiveTab(link);
      });
    });

    // Set the first tab as active by default
    setActiveTab(tabLinks[0]);
  });