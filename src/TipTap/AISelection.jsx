import { mergeAttributes, Mark } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'


export const AISelection = Mark.create({
  name: 'AISelection',
  inline: true,
  group: 'inline',

  addStorage() {
    return {
      navigationPos: undefined,
      selectedMarkID: null,
      markIDs: [],
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
      },
      dataReplaceText: {
        default: null
      } // Define a new attribute
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[class=ai-selection]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({
        class: 'ai-selection',
      }, HTMLAttributes),
      0
    ];
  },

  addCommands() {
    return {
      toggleAISelection: attributes => ({ commands }) => {
        return commands.toggleMark('AISelection', attributes);
      },

      getIDPos: attributes => ({ commands }) => {
        const { state, dispatch, storage } = this.editor;
        let from, to;

        state.doc.descendants((node, pos) => {
          node.marks.forEach(mark => {
            if (mark.attrs.id === attributes.id) {
              from = pos;
              to = pos + node.nodeSize;
            }
          });
        });

        return { from, to };
      },

      replaceSelectionText: attributes => ({ commands }) => {
        const markID = this.editor.storage.selectedMarkID;
        const storedMark = document.getElementById(markID);

        if (storedMark) {
          const { from, to } = this.editor.commands.getIDPos({id: markID});

          let replacement_text = storedMark.getAttribute("datareplacetext")

          commands.insertContentAt({
            from: from,
            to: to
          }, replacement_text);
        }
      },

      removeSelectionMark: attributes => ({ chain }) => {
        const { from, to } = this.editor.commands.getIDPos({id: this.editor.storage.selectedMarkID});
        chain().setTextSelection({ from: from, to: to }).unsetMark('AISelection').run();
      },

      setNextMark: attributes => ({ commands }) => {
        // find the ID of the mark in markIDs, change the selection to the next one
        function getNextMarkID(currentMarkID, markIDs) {
          // Find the index of the current markID in the array
          const currentIndex = markIDs.indexOf(currentMarkID);

          // Check if the markID is found
          if (currentIndex === -1) {
            // If not found, return null or handle as appropriate
            return null;
          }

          // Calculate the index of the next markID
          const nextIndex = (currentIndex + 1) % markIDs.length;

          // Return the next markID
          return markIDs[nextIndex];
        }

        const nextMarkID = getNextMarkID(this.editor.storage.selectedMarkID, this.editor.storage.markIDs);

        if (nextMarkID) {
          this.editor.storage.selectedMarkID = nextMarkID;
          window.dispatchEvent(new CustomEvent('ai-selection-click', { detail: { id: nextMarkID } }));

          const {from, to} = this.editor.commands.getIDPos({id: nextMarkID});
          commands.focus((from + 1));
        }
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('aiSelectionHover'),
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const { target } = event;
              if (target.matches('.ai-selection')) {
                const id = target.getAttribute('id'); // Access the ID attribute
                // save in storage
                this.editor.storage.selectedMarkID = id;
                window.dispatchEvent(new CustomEvent('ai-selection-click', { detail: { id } }));
              }
              return false;
            },
          }
        },
      }),
    ]
  },
});


function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export function markInstances(editor, identified_texts) {
  const instances = [];

  console.log("Text is", identified_texts)

  identified_texts.map((text) => {
    let searchText = text.phrase;
    let replaceText = text.paraphrase;

    // Iterate over the document
    editor.state.doc.descendants((node, pos) => {
      if (node.isText) {
        let fromIndex = node.text.indexOf(searchText);
        while (fromIndex !== -1) {
          const from = pos + fromIndex;
          const to = from + searchText.length;
          const id = uuidv4();

          instances.push({ id, from, to, content: searchText });

          // Use TipTap's commands to apply the mark
          editor.chain().setTextSelection({ from: from, to: to }).setMark('AISelection', {
            class: 'ai-selection',
            id: id,
            dataReplaceText: replaceText
          }).run();

          // Search for the next instance in this text node
          fromIndex = node.text.indexOf(searchText, fromIndex + searchText.length);
        }
      }
    });

    editor.storage.markIDs = instances.map((instance) => instance.id);

    return instances;


  });


}
