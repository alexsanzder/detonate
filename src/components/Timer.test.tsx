import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import Timer from './Timer';

describe('<Timer/>', () => {
  it('Renders  correctly', () => {
    const { getByTestId, queryByPlaceholderText } = render(<Timer />);
    expect(getByTestId('play-button')).toBeTruthy();
    expect(queryByPlaceholderText('What are you working on?')).toBeTruthy();
  });

  describe('Input description', () => {
    it('Updates on change', async () => {
      const { queryByPlaceholderText } = render(<Timer />);
      const descriptionInput = await waitForElement(() =>
        queryByPlaceholderText('What are you working on?')
      );

      fireEvent.change(descriptionInput, {
        target: {
          value: 'Testing',
        },
      });
      expect(descriptionInput.value).toBe('Testing');
    });
  });

  describe('Button play', () => {
    describe('with no description', () => {
      it('toggle timer', async () => {
        const { getByTestId, queryByPlaceholderText } = render(<Timer />);
        const descriptionInput = queryByPlaceholderText(
          'What are you working on?'
        );

        fireEvent.click(getByTestId('play-button'));

        const timerInput = queryByPlaceholderText('00:00:00');

        expect(descriptionInput.value).toBe('(no description)');
        expect(timerInput?.value).toBe('00:00:00');
      });
    });
  });
});
