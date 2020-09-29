import React from 'react'
import { render } from '@testing-library/react'

import { Listbox } from './listbox'
import { suppressConsoleLogs } from '../../test-utils/suppress-console-logs'
import {
  click,
  focus,
  mouseMove,
  mouseLeave,
  press,
  shift,
  type,
  word,
  Keys,
} from '../../test-utils/interactions'
import {
  assertActiveElement,
  assertActiveListboxItem,
  assertListbox,
  assertListboxButton,
  assertListboxButtonLinkedWithListbox,
  assertListboxButtonLinkedWithListboxLabel,
  assertListboxItem,
  assertListboxLabel,
  assertListboxLabelLinkedWithListbox,
  assertNoActiveListboxItem,
  assertNoSelectedListboxItem,
  getListbox,
  getListboxButton,
  getListboxButtons,
  getListboxes,
  getListboxItems,
  getListboxLabel,
  ListboxState,
} from '../../test-utils/accessibility-assertions'

jest.mock('../../hooks/use-id')

beforeAll(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(setImmediate as any)
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(clearImmediate as any)
})

afterAll(() => jest.restoreAllMocks())

describe('safeguards', () => {
  it.each([
    ['Listbox.Button', Listbox.Button],
    ['Listbox.Label', Listbox.Label],
    ['Listbox.Items', Listbox.Items],
    ['Listbox.Item', Listbox.Item],
  ])(
    'should error when we are using a <%s /> without a parent <Listbox />',
    suppressConsoleLogs((name, Component) => {
      expect(() => render(React.createElement(Component))).toThrowError(
        `<${name} /> is missing a parent <Listbox /> component.`
      )
    })
  )

  it(
    'should be possible to render a Listbox without crashing',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="a">Item A</Listbox.Item>
            <Listbox.Item value="b">Item B</Listbox.Item>
            <Listbox.Item value="c">Item C</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      assertListboxButton({
        state: ListboxState.Closed,
        attributes: { id: 'headlessui-listbox-button-1' },
      })
      assertListbox({ state: ListboxState.Closed })
    })
  )
})

describe('Rendering', () => {
  describe('Listbox', () => {
    it(
      'should be possilbe to render a Listbox using a render prop',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            {({ open }) => (
              <>
                <Listbox.Button>Trigger</Listbox.Button>
                {open && (
                  <Listbox.Items>
                    <Listbox.Item value="a">Item A</Listbox.Item>
                    <Listbox.Item value="b">Item B</Listbox.Item>
                    <Listbox.Item value="c">Item C</Listbox.Item>
                  </Listbox.Items>
                )}
              </>
            )}
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        await click(getListboxButton())

        assertListboxButton({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Open })
      })
    )
  })

  describe('Listbox.Label', () => {
    it(
      'should be possible to render a Listbox.Label using a render prop',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Label>{JSON.stringify}</Listbox.Label>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-2' },
        })
        assertListboxLabel({
          attributes: { id: 'headlessui-listbox-label-1' },
          textContent: JSON.stringify({ open: false }),
        })
        assertListbox({ state: ListboxState.Closed })

        await click(getListboxButton())

        assertListboxLabel({
          attributes: { id: 'headlessui-listbox-label-1' },
          textContent: JSON.stringify({ open: true }),
        })
        assertListbox({ state: ListboxState.Open })
        assertListboxLabelLinkedWithListbox()
        assertListboxButtonLinkedWithListboxLabel()
      })
    )

    it(
      'should be possible to render a Listbox.Label using a render prop and an `as` prop',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Label as="p">{JSON.stringify}</Listbox.Label>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxLabel({
          attributes: { id: 'headlessui-listbox-label-1' },
          textContent: JSON.stringify({ open: false }),
          tag: 'p',
        })
        assertListbox({ state: ListboxState.Closed })

        await click(getListboxButton())
        assertListboxLabel({
          attributes: { id: 'headlessui-listbox-label-1' },
          textContent: JSON.stringify({ open: true }),
          tag: 'p',
        })
        assertListbox({ state: ListboxState.Open })
      })
    )
  })

  describe('Listbox.Button', () => {
    it(
      'should be possible to render a Listbox.Button using a render prop',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>{JSON.stringify}</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
          textContent: JSON.stringify({ open: false, focused: false }),
        })
        assertListbox({ state: ListboxState.Closed })

        await click(getListboxButton())

        assertListboxButton({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-button-1' },
          textContent: JSON.stringify({ open: true, focused: false }),
        })
        assertListbox({ state: ListboxState.Open })
      })
    )

    it(
      'should be possible to render a Listbox.Button using a render prop and an `as` prop',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button as="div" role="button">
              {JSON.stringify}
            </Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
          textContent: JSON.stringify({ open: false, focused: false }),
        })
        assertListbox({ state: ListboxState.Closed })

        await click(getListboxButton())

        assertListboxButton({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-button-1' },
          textContent: JSON.stringify({ open: true, focused: false }),
        })
        assertListbox({ state: ListboxState.Open })
      })
    )

    it(
      'should be possible to render a Listbox.Button and a Listbox.Label and see them linked together',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Label>Label</Listbox.Label>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // TODO: Needed to make it similar to vue test implementation?
        // await new Promise(requestAnimationFrame)

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-2' },
        })
        assertListbox({ state: ListboxState.Closed })
        assertListboxButtonLinkedWithListboxLabel()
      })
    )
  })

  describe('Listbox.Items', () => {
    it(
      'should be possible to render Listbox.Items using a render prop',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              {data => (
                <>
                  <Listbox.Item value="a">{JSON.stringify(data)}</Listbox.Item>
                </>
              )}
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        await click(getListboxButton())

        assertListboxButton({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({
          state: ListboxState.Open,
          textContent: JSON.stringify({ open: true }),
        })
        assertActiveElement(getListbox())
      })
    )

    it('should be possible to always render the Listbox.Items if we provide it a `static` prop', () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items static>
            <Listbox.Item value="a">Item A</Listbox.Item>
            <Listbox.Item value="b">Item B</Listbox.Item>
            <Listbox.Item value="c">Item C</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Let's verify that the Listbox is already there
      expect(getListbox()).not.toBe(null)
    })
  })

  describe('Listbox.Item', () => {
    it(
      'should be possible to render a Listbox.Item using a render prop',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">{JSON.stringify}</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        await click(getListboxButton())

        assertListboxButton({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({
          state: ListboxState.Open,
          textContent: JSON.stringify({ active: false, selected: false, disabled: false }),
        })
      })
    )
  })
})

describe('Rendering composition', () => {
  it(
    'should be possible to conditionally render classNames (aka className can be a function?!)',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="a" className={bag => JSON.stringify(bag)}>
              Item A
            </Listbox.Item>
            <Listbox.Item value="b" disabled className={bag => JSON.stringify(bag)}>
              Item B
            </Listbox.Item>
            <Listbox.Item value="c" className="no-special-treatment">
              Item C
            </Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      assertListboxButton({
        state: ListboxState.Closed,
        attributes: { id: 'headlessui-listbox-button-1' },
      })
      assertListbox({ state: ListboxState.Closed })

      // Open Listbox
      await click(getListboxButton())

      const items = getListboxItems()

      // Verify correct classNames
      expect('' + items[0].classList).toEqual(
        JSON.stringify({ active: false, selected: false, disabled: false })
      )
      expect('' + items[1].classList).toEqual(
        JSON.stringify({ active: false, selected: false, disabled: true })
      )
      expect('' + items[2].classList).toEqual('no-special-treatment')

      // Double check that nothing is active
      assertNoActiveListboxItem(getListbox())

      // Make the first item active
      await press(Keys.ArrowDown)

      // Verify the classNames
      expect('' + items[0].classList).toEqual(
        JSON.stringify({ active: true, selected: false, disabled: false })
      )
      expect('' + items[1].classList).toEqual(
        JSON.stringify({ active: false, selected: false, disabled: true })
      )
      expect('' + items[2].classList).toEqual('no-special-treatment')

      // Double check that the first item is the active one
      assertActiveListboxItem(items[0])

      // Let's go down, this should go to the third item since the second item is disabled!
      await press(Keys.ArrowDown)

      // Verify the classNames
      expect('' + items[0].classList).toEqual(
        JSON.stringify({ active: false, selected: false, disabled: false })
      )
      expect('' + items[1].classList).toEqual(
        JSON.stringify({ active: false, selected: false, disabled: true })
      )
      expect('' + items[2].classList).toEqual('no-special-treatment')

      // Double check that the last item is the active one
      assertActiveListboxItem(items[2])
    })
  )

  it(
    'should be possible to swap the Listbox item with a button for example',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item as="button" value="a">
              Item A
            </Listbox.Item>
            <Listbox.Item as="button" value="b">
              Item B
            </Listbox.Item>
            <Listbox.Item as="button" value="c">
              Item C
            </Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      assertListboxButton({
        state: ListboxState.Closed,
        attributes: { id: 'headlessui-listbox-button-1' },
      })
      assertListbox({ state: ListboxState.Closed })

      // Open Listbox
      await click(getListboxButton())

      // Verify items are buttons now
      const items = getListboxItems()
      items.forEach(item => assertListboxItem(item, { tag: 'button' }))
    })
  )
})

describe('Keyboard interactions', () => {
  describe('`Enter` key', () => {
    it(
      'should be possible to open the listbox with Enter',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item, { selected: false }))

        // Verify that the first listbox item is active
        assertActiveListboxItem(items[0])
        assertNoSelectedListboxItem()
      })
    )

    it(
      'should be possible to open the listbox with Enter, and focus the selected item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value="b" onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach((item, i) => assertListboxItem(item, { selected: i === 1 }))

        // Verify that the second listbox item is active (because it is already selected)
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should have no active listbox item when there are no listbox items at all',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items />
          </Listbox>
        )

        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)
        assertListbox({ state: ListboxState.Open })
        assertActiveElement(getListbox())

        assertNoActiveListboxItem()
      })
    )

    it(
      'should focus the first non disabled listbox item when opening with Enter',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        const items = getListboxItems()

        // Verify that the first non-disabled listbox item is active
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should focus the first non disabled listbox item when opening with Enter (jump over multiple disabled ones)',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        const items = getListboxItems()

        // Verify that the first non-disabled listbox item is active
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should have no active listbox item upon Enter key press, when there are no non-disabled listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        assertNoActiveListboxItem()
      })
    )

    it(
      'should be possible to close the listbox with Enter when there is no active listboxitem',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Open listbox
        await click(getListboxButton())

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })

        // Close listbox
        await press(Keys.Enter)

        // Verify it is closed
        assertListboxButton({ state: ListboxState.Closed })
        assertListbox({ state: ListboxState.Closed })
      })
    )

    it(
      'should be possible to close the listbox with Enter and choose the active listbox item',
      suppressConsoleLogs(async () => {
        const handleChange = jest.fn()
        render(
          <Listbox value={undefined} onChange={handleChange}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Open listbox
        await click(getListboxButton())

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })

        // Activate the first listbox item
        const items = getListboxItems()
        await mouseMove(items[0])

        // Choose item, and close listbox
        await press(Keys.Enter)

        // Verify it is closed
        assertListboxButton({ state: ListboxState.Closed })
        assertListbox({ state: ListboxState.Closed })

        // Verify we got the change event
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith('a')
      })
    )
  })

  describe('`Space` key', () => {
    it(
      'should be possible to open the listbox with Space',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Space)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[0])
      })
    )

    it(
      'should be possible to open the listbox with Space, and focus the selected item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value="b" onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Space)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach((item, i) => assertListboxItem(item, { selected: i === 1 }))

        // Verify that the second listbox item is active (because it is already selected)
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should have no active listbox item when there are no listbox items at all',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items />
          </Listbox>
        )

        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Space)
        assertListbox({ state: ListboxState.Open })
        assertActiveElement(getListbox())

        assertNoActiveListboxItem()
      })
    )

    it(
      'should focus the first non disabled listbox item when opening with Space',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Space)

        const items = getListboxItems()

        // Verify that the first non-disabled listbox item is active
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should focus the first non disabled listbox item when opening with Space (jump over multiple disabled ones)',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Space)

        const items = getListboxItems()

        // Verify that the first non-disabled listbox item is active
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should have no active listbox item upon Space key press, when there are no non-disabled listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Space)

        assertNoActiveListboxItem()
      })
    )

    it(
      'should be possible to close the listbox with Space and choose the active listbox item',
      suppressConsoleLogs(async () => {
        const handleChange = jest.fn()
        render(
          <Listbox value={undefined} onChange={handleChange}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Open listbox
        await click(getListboxButton())

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })

        // Activate the first listbox item
        const items = getListboxItems()
        await mouseMove(items[0])

        // Choose item, and close listbox
        await press(Keys.Space)

        // Verify it is closed
        assertListboxButton({ state: ListboxState.Closed })
        assertListbox({ state: ListboxState.Closed })

        // Verify we got the change event
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith('a')
      })
    )
  })

  describe('`Escape` key', () => {
    it(
      'should be possible to close an open listbox with Escape',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Space)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Close listbox
        await press(Keys.Escape)

        // Verify it is closed
        assertListboxButton({ state: ListboxState.Closed })
        assertListbox({ state: ListboxState.Closed })
      })
    )
  })

  describe('`Tab` key', () => {
    it(
      'should focus trap when we use Tab',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[0])

        // Try to tab
        await press(Keys.Tab)

        // Verify it is still open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({ state: ListboxState.Open })
        assertActiveElement(getListbox())
      })
    )

    it(
      'should focus trap when we use Shift+Tab',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[0])

        // Try to Shift+Tab
        await press(shift(Keys.Tab))

        // Verify it is still open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({ state: ListboxState.Open })
        assertActiveElement(getListbox())
      })
    )
  })

  describe('`ArrowDown` key', () => {
    it(
      'should be possible to open the listbox with ArrowDown',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowDown)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))

        // Verify that the first listbox item is active
        assertActiveListboxItem(items[0])
      })
    )

    it(
      'should be possible to open the listbox with ArrowDown, and focus the selected item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value="b" onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowDown)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach((item, i) => assertListboxItem(item, { selected: i === 1 }))

        // Verify that the second listbox item is active (because it is already selected)
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should have no active listbox item when there are no listbox items at all',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items />
          </Listbox>
        )

        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowDown)
        assertListbox({ state: ListboxState.Open })
        assertActiveElement(getListbox())

        assertNoActiveListboxItem()
      })
    )

    it(
      'should be possible to use ArrowDown to navigate the listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[0])

        // We should be able to go down once
        await press(Keys.ArrowDown)
        assertActiveListboxItem(items[1])

        // We should be able to go down again
        await press(Keys.ArrowDown)
        assertActiveListboxItem(items[2])

        // We should NOT be able to go down again (because last item). Current implementation won't go around.
        await press(Keys.ArrowDown)
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to use ArrowDown to navigate the listbox items and skip the first disabled one',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[1])

        // We should be able to go down once
        await press(Keys.ArrowDown)
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to use ArrowDown to navigate the listbox items and jump to the first non-disabled one',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[2])
      })
    )
  })

  describe('`ArrowUp` key', () => {
    it(
      'should be possible to open the listbox with ArrowUp and the last item should be active',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))

        // ! ALERT: The LAST item should now be active
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to open the listbox with ArrowUp, and focus the selected item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value="b" onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach((item, i) => assertListboxItem(item, { selected: i === 1 }))

        // Verify that the second listbox item is active (because it is already selected)
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should have no active listbox item when there are no listbox items at all',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items />
          </Listbox>
        )

        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)
        assertListbox({ state: ListboxState.Open })
        assertActiveElement(getListbox())

        assertNoActiveListboxItem()
      })
    )

    it(
      'should be possible to use ArrowUp to navigate the listbox items and jump to the first non-disabled one',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[0])
      })
    )

    it(
      'should not be possible to navigate up or down if there is only a single non-disabled item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[2])

        // We should not be able to go up (because those are disabled)
        await press(Keys.ArrowUp)
        assertActiveListboxItem(items[2])

        // We should not be able to go down (because this is the last item)
        await press(Keys.ArrowDown)
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to use ArrowUp to navigate the listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        assertListboxButton({
          state: ListboxState.Closed,
          attributes: { id: 'headlessui-listbox-button-1' },
        })
        assertListbox({ state: ListboxState.Closed })

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        // Verify it is open
        assertListboxButton({ state: ListboxState.Open })
        assertListbox({
          state: ListboxState.Open,
          attributes: { id: 'headlessui-listbox-items-2' },
        })
        assertActiveElement(getListbox())
        assertListboxButtonLinkedWithListbox()

        // Verify we have listbox items
        const items = getListboxItems()
        expect(items).toHaveLength(3)
        items.forEach(item => assertListboxItem(item))
        assertActiveListboxItem(items[2])

        // We should be able to go down once
        await press(Keys.ArrowUp)
        assertActiveListboxItem(items[1])

        // We should be able to go down again
        await press(Keys.ArrowUp)
        assertActiveListboxItem(items[0])

        // We should NOT be able to go up again (because first item). Current implementation won't go around.
        await press(Keys.ArrowUp)
        assertActiveListboxItem(items[0])
      })
    )
  })

  describe('`End` key', () => {
    it(
      'should be possible to use the End key to go to the last listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        const items = getListboxItems()

        // We should be on the first item
        assertActiveListboxItem(items[0])

        // We should be able to go to the last item
        await press(Keys.End)
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to use the End key to go to the last non disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        const items = getListboxItems()

        // We should be on the first item
        assertActiveListboxItem(items[0])

        // We should be able to go to the last non-disabled item
        await press(Keys.End)
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should be possible to use the End key to go to the first listbox item if that is the only non-disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.End)

        const items = getListboxItems()
        assertActiveListboxItem(items[0])
      })
    )

    it(
      'should have no active listbox item upon End key press, when there are no non-disabled listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.End)

        assertNoActiveListboxItem()
      })
    )
  })

  describe('`PageDown` key', () => {
    it(
      'should be possible to use the PageDown key to go to the last listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        const items = getListboxItems()

        // We should be on the first item
        assertActiveListboxItem(items[0])

        // We should be able to go to the last item
        await press(Keys.PageDown)
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to use the PageDown key to go to the last non disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.Enter)

        const items = getListboxItems()

        // We should be on the first item
        assertActiveListboxItem(items[0])

        // We should be able to go to the last non-disabled item
        await press(Keys.PageDown)
        assertActiveListboxItem(items[1])
      })
    )

    it(
      'should be possible to use the PageDown key to go to the first listbox item if that is the only non-disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.PageDown)

        const items = getListboxItems()
        assertActiveListboxItem(items[0])
      })
    )

    it(
      'should have no active listbox item upon PageDown key press, when there are no non-disabled listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.PageDown)

        assertNoActiveListboxItem()
      })
    )
  })

  describe('`Home` key', () => {
    it(
      'should be possible to use the Home key to go to the first listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        const items = getListboxItems()

        // We should be on the last item
        assertActiveListboxItem(items[2])

        // We should be able to go to the first item
        await press(Keys.Home)
        assertActiveListboxItem(items[0])
      })
    )

    it(
      'should be possible to use the Home key to go to the first non disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
              <Listbox.Item value="d">Item D</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.Home)

        const items = getListboxItems()

        // We should be on the first non-disabled item
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to use the Home key to go to the last listbox item if that is the only non-disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item value="d">Item D</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.Home)

        const items = getListboxItems()
        assertActiveListboxItem(items[3])
      })
    )

    it(
      'should have no active listbox item upon Home key press, when there are no non-disabled listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.Home)

        assertNoActiveListboxItem()
      })
    )
  })

  describe('`PageUp` key', () => {
    it(
      'should be possible to use the PageUp key to go to the first listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">Item A</Listbox.Item>
              <Listbox.Item value="b">Item B</Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        const items = getListboxItems()

        // We should be on the last item
        assertActiveListboxItem(items[2])

        // We should be able to go to the first item
        await press(Keys.PageUp)
        assertActiveListboxItem(items[0])
      })
    )

    it(
      'should be possible to use the PageUp key to go to the first non disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item value="c">Item C</Listbox.Item>
              <Listbox.Item value="d">Item D</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.PageUp)

        const items = getListboxItems()

        // We should be on the first non-disabled item
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to use the PageUp key to go to the last listbox item if that is the only non-disabled listbox item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item value="d">Item D</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.PageUp)

        const items = getListboxItems()
        assertActiveListboxItem(items[3])
      })
    )

    it(
      'should have no active listbox item upon PageUp key press, when there are no non-disabled listbox items',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item disabled value="a">
                Item A
              </Listbox.Item>
              <Listbox.Item disabled value="b">
                Item B
              </Listbox.Item>
              <Listbox.Item disabled value="c">
                Item C
              </Listbox.Item>
              <Listbox.Item disabled value="d">
                Item D
              </Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        // We opened via click, we don't have an active item
        assertNoActiveListboxItem()

        // We should not be able to go to the end
        await press(Keys.PageUp)

        assertNoActiveListboxItem()
      })
    )
  })

  describe('`Any` key aka search', () => {
    it(
      'should be possible to type a full word that has a perfect match',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="alice">alice</Listbox.Item>
              <Listbox.Item value="bob">bob</Listbox.Item>
              <Listbox.Item value="charlie">charlie</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Open listbox
        await click(getListboxButton())

        const items = getListboxItems()

        // We should be able to go to the second item
        await type(word('bob'))
        assertActiveListboxItem(items[1])

        // We should be able to go to the first item
        await type(word('alice'))
        assertActiveListboxItem(items[0])

        // We should be able to go to the last item
        await type(word('charlie'))
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to type a partial of a word',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="alice">alice</Listbox.Item>
              <Listbox.Item value="bob">bob</Listbox.Item>
              <Listbox.Item value="charlie">charlie</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        const items = getListboxItems()

        // We should be on the last item
        assertActiveListboxItem(items[2])

        // We should be able to go to the second item
        await type(word('bo'))
        assertActiveListboxItem(items[1])

        // We should be able to go to the first item
        await type(word('ali'))
        assertActiveListboxItem(items[0])

        // We should be able to go to the last item
        await type(word('char'))
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should be possible to type words with spaces',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="a">value a</Listbox.Item>
              <Listbox.Item value="b">value b</Listbox.Item>
              <Listbox.Item value="c">value c</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        const items = getListboxItems()

        // We should be on the last item
        assertActiveListboxItem(items[2])

        // We should be able to go to the second item
        await type(word('value b'))
        assertActiveListboxItem(items[1])

        // We should be able to go to the first item
        await type(word('value a'))
        assertActiveListboxItem(items[0])

        // We should be able to go to the last item
        await type(word('value c'))
        assertActiveListboxItem(items[2])
      })
    )

    it(
      'should not be possible to search for a disabled item',
      suppressConsoleLogs(async () => {
        render(
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="alice">alice</Listbox.Item>
              <Listbox.Item disabled value="bob">
                bob
              </Listbox.Item>
              <Listbox.Item value="charlie">charlie</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        )

        // Focus the button
        getListboxButton()?.focus()

        // Open listbox
        await press(Keys.ArrowUp)

        const items = getListboxItems()

        // We should be on the last item
        assertActiveListboxItem(items[2])

        // We should not be able to go to the disabled item
        await type(word('bo'))

        // We should still be on the last item
        assertActiveListboxItem(items[2])
      })
    )
  })
})

describe('Mouse interactions', () => {
  it(
    'should focus the Listbox.Button when we click the Listbox.Label',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Label>Label</Listbox.Label>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="a">Item A</Listbox.Item>
            <Listbox.Item value="b">Item B</Listbox.Item>
            <Listbox.Item value="c">Item C</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Ensure the button is not focused yet
      assertActiveElement(document.body)

      // Focus the label
      await click(getListboxLabel())

      // Ensure that the actual button is focused instead
      assertActiveElement(getListboxButton())
    })
  )

  it(
    'should be possible to open a listbox on click',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="a">Item A</Listbox.Item>
            <Listbox.Item value="b">Item B</Listbox.Item>
            <Listbox.Item value="c">Item C</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      assertListboxButton({
        state: ListboxState.Closed,
        attributes: { id: 'headlessui-listbox-button-1' },
      })
      assertListbox({ state: ListboxState.Closed })

      // Open listbox
      await click(getListboxButton())

      // Verify it is open
      assertListboxButton({ state: ListboxState.Open })
      assertListbox({
        state: ListboxState.Open,
        attributes: { id: 'headlessui-listbox-items-2' },
      })
      assertActiveElement(getListbox())
      assertListboxButtonLinkedWithListbox()

      // Verify we have listbox items
      const items = getListboxItems()
      expect(items).toHaveLength(3)
      items.forEach(item => assertListboxItem(item))
    })
  )

  it(
    'should be possible to open a listbox on click, and focus the selected item',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value="b" onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="a">Item A</Listbox.Item>
            <Listbox.Item value="b">Item B</Listbox.Item>
            <Listbox.Item value="c">Item C</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      assertListboxButton({
        state: ListboxState.Closed,
        attributes: { id: 'headlessui-listbox-button-1' },
      })
      assertListbox({ state: ListboxState.Closed })

      // Open listbox
      await click(getListboxButton())

      // Verify it is open
      assertListboxButton({ state: ListboxState.Open })
      assertListbox({
        state: ListboxState.Open,
        attributes: { id: 'headlessui-listbox-items-2' },
      })
      assertActiveElement(getListbox())
      assertListboxButtonLinkedWithListbox()

      // Verify we have listbox items
      const items = getListboxItems()
      expect(items).toHaveLength(3)
      items.forEach((item, i) => assertListboxItem(item, { selected: i === 1 }))

      // Verify that the second listbox item is active (because it is already selected)
      assertActiveListboxItem(items[1])
    })
  )

  it(
    'should be possible to close a listbox on click',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="a">Item A</Listbox.Item>
            <Listbox.Item value="b">Item B</Listbox.Item>
            <Listbox.Item value="c">Item C</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      // Verify it is open
      assertListboxButton({ state: ListboxState.Open })

      // Click to close
      await click(getListboxButton())

      // Verify it is closed
      assertListboxButton({ state: ListboxState.Closed })
      assertListbox({ state: ListboxState.Closed })
    })
  )

  it('should focus the listbox when you try to focus the button again (when the listbox is already open)', async () => {
    render(
      <Listbox value={undefined} onChange={console.log}>
        <Listbox.Button>Trigger</Listbox.Button>
        <Listbox.Items>
          <Listbox.Item value="a">Item A</Listbox.Item>
          <Listbox.Item value="b">Item B</Listbox.Item>
          <Listbox.Item value="c">Item C</Listbox.Item>
        </Listbox.Items>
      </Listbox>
    )

    // Open listbox
    await click(getListboxButton())

    // Verify listbox is focused
    assertActiveElement(getListbox())

    // Try to Re-focus the button
    getListboxButton()?.focus()

    // Verify listbox is still focused
    assertActiveElement(getListbox())
  })

  it(
    'should be a no-op when we click outside of a closed listbox',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Verify that the window is closed
      assertListbox({ state: ListboxState.Closed })

      // Click something that is not related to the listbox
      await click(document.body)

      // Should still be closed
      assertListbox({ state: ListboxState.Closed })
    })
  )

  it(
    'should be possible to click outside of the listbox which should close the listbox',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())
      assertListbox({ state: ListboxState.Open })
      assertActiveElement(getListbox())

      // Click something that is not related to the listbox
      await click(document.body)

      // Should be closed now
      assertListbox({ state: ListboxState.Closed })
    })
  )

  it(
    'should be possible to click outside of the listbox on another listbox button which should close the current listbox and open the new listbox',
    suppressConsoleLogs(async () => {
      render(
        <div>
          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="alice">alice</Listbox.Item>
              <Listbox.Item value="bob">bob</Listbox.Item>
              <Listbox.Item value="charlie">charlie</Listbox.Item>
            </Listbox.Items>
          </Listbox>

          <Listbox value={undefined} onChange={console.log}>
            <Listbox.Button>Trigger</Listbox.Button>
            <Listbox.Items>
              <Listbox.Item value="alice">alice</Listbox.Item>
              <Listbox.Item value="bob">bob</Listbox.Item>
              <Listbox.Item value="charlie">charlie</Listbox.Item>
            </Listbox.Items>
          </Listbox>
        </div>
      )

      const [button1, button2] = getListboxButtons()

      // Click the first menu button
      await click(button1)
      expect(getListboxes()).toHaveLength(1) // Only 1 menu should be visible

      // Ensure the open menu is linked to the first button
      assertListboxButtonLinkedWithListbox(button1, getListbox())

      // Click the second menu button
      await click(button2)

      expect(getListboxes()).toHaveLength(1) // Only 1 menu should be visible

      // Ensure the open menu is linked to the second button
      assertListboxButtonLinkedWithListbox(button2, getListbox())
    })
  )

  it(
    'should be possible to click outside of the listbox which should close the listbox (even if we press the listbox button)',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())
      assertListbox({ state: ListboxState.Open })
      assertActiveElement(getListbox())

      // Click the listbox button again
      await click(getListboxButton())

      // Should be closed now
      assertListbox({ state: ListboxState.Closed })
    })
  )

  it(
    'should be possible to hover an item and make it active',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      const items = getListboxItems()
      // We should be able to go to the second item
      await mouseMove(items[1])
      assertActiveListboxItem(items[1])

      // We should be able to go to the first item
      await mouseMove(items[0])
      assertActiveListboxItem(items[0])

      // We should be able to go to the last item
      await mouseMove(items[2])
      assertActiveListboxItem(items[2])
    })
  )

  it(
    'should make a listbox item active when you move the mouse over it',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      const items = getListboxItems()
      // We should be able to go to the second item
      await mouseMove(items[1])
      assertActiveListboxItem(items[1])
    })
  )

  it(
    'should be a no-op when we move the mouse and the listbox item is already active',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      const items = getListboxItems()

      // We should be able to go to the second item
      await mouseMove(items[1])
      assertActiveListboxItem(items[1])

      await mouseMove(items[1])

      // Nothing should be changed
      assertActiveListboxItem(items[1])
    })
  )

  it(
    'should be a no-op when we move the mouse and the listbox item is disabled',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item disabled value="bob">
              bob
            </Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      const items = getListboxItems()

      await mouseMove(items[1])
      assertNoActiveListboxItem()
    })
  )

  it(
    'should not be possible to hover an item that is disabled',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item disabled value="bob">
              bob
            </Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      const items = getListboxItems()

      // Try to hover over item 1, which is disabled
      await mouseMove(items[1])

      // We should not have an active item now
      assertNoActiveListboxItem()
    })
  )

  it(
    'should be possible to mouse leave an item and make it inactive',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      const items = getListboxItems()

      // We should be able to go to the second item
      await mouseMove(items[1])
      assertActiveListboxItem(items[1])

      await mouseLeave(items[1])
      assertNoActiveListboxItem()

      // We should be able to go to the first item
      await mouseMove(items[0])
      assertActiveListboxItem(items[0])

      await mouseLeave(items[0])
      assertNoActiveListboxItem()

      // We should be able to go to the last item
      await mouseMove(items[2])
      assertActiveListboxItem(items[2])

      await mouseLeave(items[2])
      assertNoActiveListboxItem()
    })
  )

  it(
    'should be possible to mouse leave a disabled item and be a no-op',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item disabled value="bob">
              bob
            </Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())

      const items = getListboxItems()

      // Try to hover over item 1, which is disabled
      await mouseMove(items[1])
      assertNoActiveListboxItem()

      await mouseLeave(items[1])
      assertNoActiveListboxItem()
    })
  )

  it(
    'should be possible to click a listbox item, which closes the listbox',
    suppressConsoleLogs(async () => {
      const handleChange = jest.fn()
      render(
        <Listbox value={undefined} onChange={handleChange}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())
      assertListbox({ state: ListboxState.Open })
      assertActiveElement(getListbox())

      const items = getListboxItems()

      // We should be able to click the first item
      await click(items[1])
      assertListbox({ state: ListboxState.Closed })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith('bob')
    })
  )

  it(
    'should be possible to click a disabled listbox item, which is a no-op',
    suppressConsoleLogs(async () => {
      const handleChange = jest.fn()
      render(
        <Listbox value={undefined} onChange={handleChange}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item disabled value="bob">
              bob
            </Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())
      assertListbox({ state: ListboxState.Open })
      assertActiveElement(getListbox())

      const items = getListboxItems()

      // We should be able to click the first item
      await click(items[1])
      assertListbox({ state: ListboxState.Open })
      assertActiveElement(getListbox())
      expect(handleChange).toHaveBeenCalledTimes(0)
    })
  )

  it(
    'should be possible focus a listbox item, so that it becomes active',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item value="bob">bob</Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())
      assertListbox({ state: ListboxState.Open })
      assertActiveElement(getListbox())

      const items = getListboxItems()

      // Verify that nothing is active yet
      assertNoActiveListboxItem()

      // We should be able to focus the first item
      await focus(items[1])
      assertActiveListboxItem(items[1])
    })
  )

  it(
    'should not be possible to focus a listbox item which is disabled',
    suppressConsoleLogs(async () => {
      render(
        <Listbox value={undefined} onChange={console.log}>
          <Listbox.Button>Trigger</Listbox.Button>
          <Listbox.Items>
            <Listbox.Item value="alice">alice</Listbox.Item>
            <Listbox.Item disabled value="bob">
              bob
            </Listbox.Item>
            <Listbox.Item value="charlie">charlie</Listbox.Item>
          </Listbox.Items>
        </Listbox>
      )

      // Open listbox
      await click(getListboxButton())
      assertListbox({ state: ListboxState.Open })
      assertActiveElement(getListbox())

      const items = getListboxItems()

      // We should not be able to focus the first item
      await focus(items[1])
      assertNoActiveListboxItem()
    })
  )
})
