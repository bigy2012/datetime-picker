class MinimalDateTimePicker {
    constructor(options = {}) {
      this.config = {
        timeFormat: options.timeFormat || "24h", // '24h' or '12h'
        weekdays: options.weekdays || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months: options.months || [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        onSelect: options.onSelect || null,
        element: null,
        pickerContainerId:
          options.pickerContainerId || "minimal-datetime-picker-container"
      };
  
      this.savedDateTime = null;
      this.initialized = false;
    }
  
    // Initialize the picker on a specific element
    init(selector) {
      if (typeof selector === "string") {
        this.config.element = document.querySelector(selector);
      } else if (selector instanceof HTMLElement) {
        this.config.element = selector;
      } else {
        throw new Error(
          "Invalid selector. Please provide a CSS selector string or HTML Element."
        );
      }
  
      if (!this.config.element) {
        throw new Error(`Element not found with selector: ${selector}`);
      }
  
      // Make input read-only and add click handler
      this.config.element.setAttribute("readonly", true);
    //   this.config.element.setAttribute("placeholder", "Select date and time");
      this.config.element.addEventListener("click", (e) => this.openPicker(e));
  
      // Create picker container if it doesn't exist
      if (!document.getElementById(this.config.pickerContainerId)) {
        const pickerContainer = document.createElement("div");
        pickerContainer.id = this.config.pickerContainerId;
        document.body.appendChild(pickerContainer);
      }
  
      this.initialized = true;
      return this;
    }
  
    // Create and render the picker popup
    createPickerElement() {
      const container = document.getElementById(this.config.pickerContainerId);
      container.innerHTML = "";
  
      // Create picker overlay
      const overlay = document.createElement("div");
      overlay.className = "picker-overlay";
      overlay.id = "pickerOverlay";
      overlay.style.display = "none";
      overlay.style.position = "absolute";
      overlay.style.zIndex = "100";
  
      // Create picker popup
      const popup = document.createElement("div");
      popup.className = "picker-popup";
      popup.style.background = "#fff";
      popup.style.padding = "16px";
      popup.style.borderRadius = "8px";
      popup.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.16)";
      popup.style.width = "280px";
      popup.style.fontFamily =
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
      // Header
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.alignItems = "center";
      header.style.marginBottom = "16px";
  
      const title = document.createElement("h3");
      title.textContent = "Select Date & Time";
      title.style.fontSize = "1rem";
      title.style.fontWeight = "500";
      title.style.color = "#475569";
      title.style.margin = "0";
  
      const closeBtn = document.createElement("button");
      closeBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
      closeBtn.style.background = "none";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.color = "#94a3b8";
      closeBtn.addEventListener("click", () => this.closePicker());
  
      header.appendChild(title);
      header.appendChild(closeBtn);
  
      // Year/Month selector
      const yearMonthSelector = document.createElement("div");
      yearMonthSelector.style.display = "flex";
      yearMonthSelector.style.gap = "5px";
      yearMonthSelector.style.marginBottom = "16px";
      yearMonthSelector.style.width = "50%";
  
      const yearInput = document.createElement("input");
      yearInput.type = "number";
      yearInput.id = "yearInput";
      yearInput.className = "year-selector";
      yearInput.placeholder = "Year";
      yearInput.style.flex = "1";
      yearInput.style.border = "1px solid #e9e3e3";
      yearInput.style.color = "#000000";
      yearInput.style.width = "-webkit-fill-available";
    //   yearInput.style.backgroundColor = "#f8fafc";
      yearInput.style.padding = "8px";
      yearInput.style.borderRadius = "4px";
      yearInput.addEventListener("input", () => this.renderCalendar());
  
      const monthInput = document.createElement("input");
      monthInput.type = "number";
      monthInput.id = "monthInput";
      monthInput.className = "month-selector";
      monthInput.placeholder = "Month (1-12)";
      monthInput.style.flex = "1";
      monthInput.style.border = "1px solid #e9e3e3";
      monthInput.style.color = "#000000";
      monthInput.style.width = "-webkit-fill-available";
    //   monthInput.style.backgroundColor = "#f8fafc";
      monthInput.style.padding = "8px";
      monthInput.style.borderRadius = "4px";
      monthInput.addEventListener("input", () => this.renderCalendar());
  
      yearMonthSelector.appendChild(yearInput);
      yearMonthSelector.appendChild(monthInput);
  
      // Calendar container
      const calendar = document.createElement("div");
      calendar.id = "calendar";
      calendar.style.marginBottom = "16px";
  
      // Time picker
      const timePicker = document.createElement("input");
      timePicker.type = "time";
      timePicker.id = "timePicker";
      timePicker.className = "time-selector";
      timePicker.style.width = "100%";
      timePicker.style.border = "1px solid #e9e3e3";
      timePicker.style.color = "#000000";
      timePicker.style.backgroundColor = "#f8fafc";
      timePicker.style.padding = "8px";
      timePicker.style.borderRadius = "4px";
      timePicker.style.marginBottom = "16px";
  
      // Button container
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "flex-end";
      buttonContainer.style.gap = "8px";
  
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.padding = "6px 12px";
      cancelBtn.style.backgroundColor = "transparent";
      cancelBtn.style.color = "#64748b";
      cancelBtn.style.border = "none";
      cancelBtn.style.borderRadius = "4px";
      cancelBtn.style.cursor = "pointer";
      cancelBtn.style.fontSize = "0.875rem";
      cancelBtn.style.fontWeight = "500";
      cancelBtn.addEventListener("click", () => this.closePicker());
  
      const okBtn = document.createElement("button");
      okBtn.textContent = "OK";
      okBtn.style.padding = "6px 12px";
      okBtn.style.backgroundColor = "#3b82f6";
      okBtn.style.color = "white";
      okBtn.style.border = "none";
      okBtn.style.borderRadius = "4px";
      okBtn.style.cursor = "pointer";
      okBtn.style.fontSize = "0.875rem";
      okBtn.style.fontWeight = "500";
      okBtn.addEventListener("click", () => this.setDateTime());
  
      buttonContainer.appendChild(cancelBtn);
      buttonContainer.appendChild(okBtn);
  
      // Append all elements to the popup
      popup.appendChild(header);
      popup.appendChild(yearMonthSelector);
      popup.appendChild(calendar);
      popup.appendChild(timePicker);
      popup.appendChild(buttonContainer);
  
      overlay.appendChild(popup);
      container.appendChild(overlay);
  
      // Add CSS for calendar days
      const style = document.createElement("style");
      style.textContent = `
          .calendar-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
          }
          .weekday-labels {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            margin-bottom: 4px;
          }
          .weekday-label {
            text-align: center;
            font-size: 0.75rem;
            color: #94a3b8;
            padding: 4px 0;
          }
          .calendar-days button {
            padding: 4px 0;
            background: transparent;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.15s ease;
            color: #475569;
            aspect-ratio: 1;
          }
          .calendar-days button:hover {
            background: #f1f5f9;
          }
          .selected-date {
            background: #3b82f6 !important;
            color: #ffffff !important;
            font-weight: 500;
          }
          .calendar-days button.today {
            font-weight: 500;
            border: 1px solid #e2e8f0;
          }
        `;
      document.head.appendChild(style);
  
      return overlay;
    }
  
    openPicker(event) {
      if (!this.initialized) {
        throw new Error("Picker not initialized. Call init() first.");
      }
  
      const picker = this.createPickerElement();
      const inputRect = event.target.getBoundingClientRect();
  
      picker.style.display = "block";
      picker.style.left = `${inputRect.left - 31}px`;
      picker.style.top = `${inputRect.bottom + window.scrollY + 5}px`;
  
      this.initYearMonthInput();
      this.renderCalendar();
      this.renderTimeOptions();
  
      // Add click outside listener
      document.addEventListener("click", this.handleOutsideClick);
    }
  
    handleOutsideClick = (event) => {
      const picker = document.getElementById("pickerOverlay");
      const input = this.config.element;
  
      if (
        picker &&
        picker.style.display === "block" &&
        !picker.contains(event.target) &&
        event.target !== input
      ) {
        this.setDateTime();
        this.closePicker();
      }
    };
  
    closePicker() {
      const picker = document.getElementById("pickerOverlay");
      if (picker) {
        picker.style.display = "none";
        document.removeEventListener("click", this.handleOutsideClick);
      }
    }
  
    setDateTime() {
      const selectedDateEl = document.querySelector(".selected-date");
      const selectedDate = selectedDateEl ? selectedDateEl.dataset.date : null;
      const timePickerEl = document.getElementById("timePicker");
      const selectedTime = timePickerEl ? timePickerEl.value : null;
  
      if (selectedDate && selectedTime) {
        const formattedDate = this.formatSelectedDate(selectedDate);
        this.config.element.value = `${formattedDate} ${selectedTime}`;
        this.savedDateTime = `${selectedDate} ${selectedTime}`;
  
        // Call onSelect callback if provided
        if (typeof this.config.onSelect === "function") {
          const [year, month, day] = selectedDate.split("-");
          const [hours, minutes] = selectedTime.split(":");
  
          const dateObj = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
          );
  
          this.config.onSelect({
            formattedString: `${formattedDate} ${selectedTime}`,
            date: dateObj,
            components: {
              year: parseInt(year),
              month: parseInt(month),
              day: parseInt(day),
              hours: parseInt(hours),
              minutes: parseInt(minutes)
            }
          });
        }
      }
  
      this.closePicker();
    }
  
    formatSelectedDate(dateStr) {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }
  
    renderCalendar() {
      const calendar = document.getElementById("calendar");
      const yearInput = document.getElementById("yearInput");
      const monthInput = document.getElementById("monthInput");
  
      if (!calendar || !yearInput || !monthInput) return;
  
      const year = parseInt(yearInput.value) || new Date().getFullYear();
      const month = parseInt(monthInput.value) || new Date().getMonth() + 1;
  
      calendar.innerHTML = "";
  
      // Get the first day of the month
      const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
      const daysInMonth = new Date(year, month, 0).getDate();
  
      // Add weekday labels
      const weekdayLabels = document.createElement("div");
      weekdayLabels.className = "weekday-labels";
  
      for (let i = 0; i < 7; i++) {
        const label = document.createElement("div");
        label.className = "weekday-label";
        label.innerText = this.config.weekdays[i];
        weekdayLabels.appendChild(label);
      }
      calendar.appendChild(weekdayLabels);
  
      const daysContainer = document.createElement("div");
      daysContainer.className = "calendar-days";
  
      // Add empty spaces for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement("div");
        daysContainer.appendChild(emptyDay);
      }
  
      // Current date for highlighting today
      const today = new Date();
      const todayDate = today.getDate();
      const todayMonth = today.getMonth() + 1;
      const todayYear = today.getFullYear();
  
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dayButton = document.createElement("button");
        dayButton.innerText = day;
  
        const paddedMonth = String(month).padStart(2, "0");
        const paddedDay = String(day).padStart(2, "0");
        dayButton.dataset.date = `${year}-${paddedMonth}-${paddedDay}`;
  
        if (day === todayDate && month === todayMonth && year === todayYear) {
          dayButton.classList.add("today");
        }
  
        // Check if this day is the saved date
        if (this.savedDateTime) {
          const savedDate = this.savedDateTime.split(" ")[0];
          if (savedDate === `${year}-${paddedMonth}-${paddedDay}`) {
            dayButton.classList.add("selected-date");
          }
        }
  
        dayButton.onclick = () => {
          document.querySelectorAll(".calendar-days button").forEach((btn) => {
            btn.classList.remove("selected-date");
          });
          dayButton.classList.add("selected-date");
        };
  
        daysContainer.appendChild(dayButton);
      }
  
      calendar.appendChild(daysContainer);
    }
  
    initYearMonthInput() {
      const yearInput = document.getElementById("yearInput");
      const monthInput = document.getElementById("monthInput");
  
      // Check if there's already a saved value in the input
      const currentDateTime = this.config.element.value;
      if (currentDateTime) {
        const [datePart] = currentDateTime.split(" ");
        const [day, month, year] = datePart.split("/");
        yearInput.value = year;
        monthInput.value = month;
      } else {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        yearInput.value = currentYear;
        monthInput.value = currentMonth;
      }
    }
  
    renderTimeOptions() {
      const timePicker = document.getElementById("timePicker");
      const currentDateTime = this.config.element.value;
  
      if (currentDateTime) {
        const [, savedTime] = currentDateTime.split(" ");
        timePicker.value = savedTime;
      } else {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        timePicker.value = `${hours}:${minutes}`;
      }
    }
  }
  
  // Export the class for use in other modules
  module.exports = MinimalDateTimePicker;