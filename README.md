# Big DateTime Picker

A minimal datetime picker component.

## Installation

You can install the package using npm:

```sh
npm install big-datetime-picker
```
```jsx
import MinimalDateTimePicker from 'big-datetime-picker';

const dateTimePicker = new MinimalDateTimePicker({
  timeFormat: '24h', // '24h' or '12h'
  weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  onSelect: (selectedDateTime) => {
    console.log('Selected DateTime:', selectedDateTime);
  }
});

dateTimePicker.init('#datetime-input');

<input type="text" id="datetime-input" placeholder="Select date and time">
```




## Excample

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Big DateTime Picker Example</title>
  <link rel="stylesheet" href="path/to/your/styles.css">
</head>
<body>
  <input type="text" id="datetime-input" placeholder="Select date and time">

  <script type="module">
    import MinimalDateTimePicker from 'big-datetime-picker';

    const dateTimePicker = new MinimalDateTimePicker({
      timeFormat: '24h',
      weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      onSelect: (selectedDateTime) => {
        console.log('Selected DateTime:', selectedDateTime);
      }
    });

    dateTimePicker.init('#datetime-input');
  </script>
</body>
</html>
```