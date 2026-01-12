'use client';

const examples = [
  'teaching my daughter to ride a bike',
  'reading bedtime stories every night',
  'playing catch in the backyard',
  'being there for the first steps',
  'sharing my favorite childhood memories',
  'building a treehouse together',
];

export function ExampleTexts() {
  const handleExampleClick = (example: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;

      if (nativeTextareaSetter) {
        nativeTextareaSetter.call(textarea, example);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  return (
    <div className="mt-12">
      <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
        Need inspiration?
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((example, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleExampleClick(example)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
